<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function __construct(
        private readonly Tag $tag
    ) {}

    /**
     * Display a listing of tags.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $tags = Tag::with('createdUser')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tag/index', [
            'tags' => $tags,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:tags'],
        ]);

        $user = $request->user();
        $data['created_user_id'] = $user->id;
        $data['is_public'] = $user->role === UserRole::ADMIN;

        Tag::create($data);

        return redirect()->route('tags.index');
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:tags,name,' . $id],
        ]);

        $tag = Tag::findOrFail($id);
        $tag->update($data);

        return redirect()->route('tags.index');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(string $id): \Illuminate\Http\RedirectResponse
    {
        \Log::info('Tag delete attempt', ['id' => $id]);
        
        $tag = Tag::findOrFail($id);
        
        \Log::info('Tag found, deleting', ['tag' => $tag->name]);
        
        $tag->delete();
        
        \Log::info('Tag deleted successfully');

        return redirect()->route('tags.index');
    }
}
