"use client";

import { useState } from "react";
import { type DocumentActionComponent, type DocumentActionsResolver } from "sanity";

const translatableTypes = new Set([
  "sidebarProfile",
  "homeProfile",
  "aboutProfile",
  "homeContent",
  "aboutContent",
  "careerContent",
  "achievementContent",
  "projectContent",
  "personalProjectContent",
  "contactContent",
  "education",
  "job",
  "project",
  "contact",
  "github",
]);

const isSourceIndonesianDocument = (
  id: string,
  sourceLanguage?: string
) => sourceLanguage !== "en" && !id.endsWith("-en");

const TranslateToEnAction: DocumentActionComponent = (props) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const source = (props.draft || props.published) as Record<string, unknown> | null;
  const languageValue = source?.language;
  const sourceLanguage = typeof languageValue === "string" ? languageValue : undefined;

  const isAllowedType = translatableTypes.has(props.type);
  const isSourceIndonesian = isSourceIndonesianDocument(props.id, sourceLanguage);

  if (!isAllowedType) {
    return null;
  }

  return {
    label: isTranslating ? "Translating..." : "Translate to EN",
    disabled: isTranslating || !source || !isSourceIndonesian,
    onHandle: async () => {
      if (!source) {
        props.onComplete();
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate-to-en", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: props.id,
            type: props.type,
            document: source,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || "Translation failed");
        }

        window.alert("Translation saved to EN document successfully.");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Translation failed";
        window.alert(`Translate to EN failed: ${message}`);
      } finally {
        setIsTranslating(false);
        props.onComplete();
      }
    },
  };
};

const withAutoTranslateOnPublish = (
  originalAction: DocumentActionComponent,
  schemaType: string
): DocumentActionComponent => {
  const WrappedAction: DocumentActionComponent = (props) => {
    const [isAutoTranslating, setIsAutoTranslating] = useState(false);
    const originalResult = originalAction(props);

    if (!originalResult) return originalResult;

    const isPublishAction =
      typeof originalResult.label === "string" &&
      originalResult.label.toLowerCase() === "publish";

    if (!isPublishAction) {
      return originalResult;
    }

    return {
      ...originalResult,
      disabled: originalResult.disabled || isAutoTranslating,
      label: isAutoTranslating ? "Publishing + Translating..." : originalResult.label,
      onHandle: async () => {
        const source = (props.draft || props.published) as Record<string, unknown> | null;
        const languageValue = source?.language;
        const sourceLanguage = typeof languageValue === "string" ? languageValue : undefined;
        const shouldAutoTranslate =
          translatableTypes.has(schemaType) &&
          !!source &&
          isSourceIndonesianDocument(props.id, sourceLanguage);

        setIsAutoTranslating(true);

        try {
          if (shouldAutoTranslate && source) {
            const response = await fetch("/api/translate-to-en", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: props.id,
                type: props.type,
                document: source,
              }),
            });

            if (!response.ok) {
              const result = await response.json().catch(() => ({}));
              throw new Error(result?.error || "Automatic EN translation failed");
            }
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Automatic EN translation failed";
          window.alert(`Auto translate saat publish gagal: ${message}`);
        } finally {
          setIsAutoTranslating(false);
          originalResult.onHandle?.();
        }
      },
    };
  };

  return WrappedAction;
};

export const documentActions: DocumentActionsResolver = (prev, context) => {
  if (!translatableTypes.has(context.schemaType)) {
    return prev;
  }
  const mappedActions = prev.map((action) => withAutoTranslateOnPublish(action, context.schemaType));
  return [...mappedActions, TranslateToEnAction];
};
