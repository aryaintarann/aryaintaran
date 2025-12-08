<?php

use App\Models\Project;
use App\Models\Setting;
use App\Models\TechStack;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $projects = Project::where('is_featured', true)->orderBy('sort_order')->get();
    $settings = Setting::pluck('value', 'key');
    $techStacks = TechStack::all();

    return view('welcome', compact('projects', 'settings', 'techStacks'));
});

Route::get('/projects/{project}', function (Project $project) {
    return response()->json($project);
})->name('projects.show');
