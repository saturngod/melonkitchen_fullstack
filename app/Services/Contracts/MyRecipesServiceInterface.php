<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\MyRecipesDataDTO;
use App\DataTransferObjects\MyRecipesFiltersDTO;
use App\Models\User;

interface MyRecipesServiceInterface
{
    public function getMyRecipesData(User $user, MyRecipesFiltersDTO $filters): MyRecipesDataDTO;
}
