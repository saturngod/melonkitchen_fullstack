<?php

namespace App\Providers;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Repositories\Eloquent\EloquentCategoryRepository;
use App\Repositories\Eloquent\EloquentRecipeRepository;
use App\Services\Contracts\HomePageServiceInterface;
use App\Services\Contracts\MyRecipesServiceInterface;
use App\Services\Contracts\PublicRecipeServiceInterface;
use App\Services\Contracts\RecipeDetailServiceInterface;
use App\Services\Contracts\SearchServiceInterface;
use App\Services\HomePageService;
use App\Services\MyRecipesService;
use App\Services\PublicRecipeService;
use App\Services\RecipeDetailService;
use App\Services\SearchService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register repository bindings
        $this->app->bind(
            RecipeRepositoryInterface::class,
            EloquentRecipeRepository::class
        );

        $this->app->bind(
            CategoryRepositoryInterface::class,
            EloquentCategoryRepository::class
        );

        // Register service bindings
        $this->app->bind(
            HomePageServiceInterface::class,
            HomePageService::class
        );

        $this->app->bind(
            RecipeDetailServiceInterface::class,
            RecipeDetailService::class
        );

        $this->app->bind(
            PublicRecipeServiceInterface::class,
            PublicRecipeService::class
        );

        $this->app->bind(
            SearchServiceInterface::class,
            SearchService::class
        );

        $this->app->bind(
            MyRecipesServiceInterface::class,
            MyRecipesService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
