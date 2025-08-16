<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\SearchFiltersDTO;
use App\DataTransferObjects\SearchDataDTO;

interface SearchServiceInterface
{
    public function search(SearchFiltersDTO $filters): SearchDataDTO;
}
