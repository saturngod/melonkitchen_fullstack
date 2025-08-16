<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\HomePageDataDTO;
use App\DataTransferObjects\HomePageFiltersDTO;

interface HomePageServiceInterface
{
    /**
     * Get data for the home page.
     */
    public function getHomePageData(HomePageFiltersDTO $filters): HomePageDataDTO;
}
