<?php

namespace App\Http\Controllers\APIs\Dashboard\Articles;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ArticleAPIController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $articles = Article::with(['user']);
        if (!auth()->user()->can('View Articles')) {
            $articles = $articles->where('user_id', auth()->user()->id);
        }
        $articles = $articles->where('title', 'LIKE', '%' . $request->search . '%')
            ->orderBy('created_at', 'DESC')->paginate(20);
        /*foreach ($articles as $article) {
                $article->description = $this->extractPreviewFromTiptap(json_decode($article->content, true));
                $article->save();
            }*/
        return response()->json(['articles' => $articles]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB
        ]);

        //$path = $request->file('image')->store('editor-images', 'public');
        $path = $request->file('image')->store('tmp/editor-images', 'public');


        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }

    public function getArticle(Request $request)
    {
        $article = Article::find($request->id);
        if ($article) {
            return response()->json(['article' => $article], 200);
        } else {
            return response()->json(['error' => 'Article not found'], 404);
        }
    }

    public function addArticle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'integer|required|min:0',
            'title' => 'nullable|string|max:255',
            'content' => 'required|array',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }


        $article = new Article();
        if ($request->id > 0) {
            $article = Article::find($request->id);
        }

        $content = $request->input('content');
        $article->title = $request->title;
        $article->content = json_encode($request->content);
        $article->description = $this->extractPreviewFromTiptap($content);
        $article->user_id = auth()->user()->id;
        if ($article->save()) {

            // Extract image URLs from content
            $usedImages = collect($content['content'])
                ->flatMap(fn($node) => $node['type'] === 'image'
                    ? [$node['attrs']['src']]
                    : []);

            // Move images
            foreach ($usedImages as $url) {
                $oldPath = str_replace(asset('storage/'), '', $url);

                if (str_starts_with($oldPath, 'tmp/')) {
                    $newPath = str_replace('tmp/editor-images', "articles/{$article->id}", $oldPath);
                    Storage::disk('public')->move($oldPath, $newPath);
                }
            }
            // Update image paths inside JSON
            $this->updateEditorImages($content['content'], $article->id);

            // Save updated content
            $article->update([
                'content' => json_encode($content),
            ]);

            return response()->json(['success' => "Article updated successfully"], 200);
        } else {
            return response()->json(['error' => "Failed to update article"], 500);
        }
    }

    function updateEditorImages(array &$nodes, int $articleId): void
    {
        foreach ($nodes as &$node) {
            // ✅ If this node is an image
            if (
                isset($node['type']) &&
                $node['type'] === 'image' &&
                isset($node['attrs']['src'])
            ) {
                $src = $node['attrs']['src'];

                // Only move temp images
                if (str_contains($src, '/storage/tmp/editor-images/')) {

                    $oldPath = str_replace(asset('storage/'), '', $src);

                    $filename = basename($oldPath);
                    $newPath = "articles/{$articleId}/{$filename}";

                    // Move file if exists
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->move($oldPath, $newPath);

                        // ✅ UPDATE JSON SRC
                        $node['attrs']['src'] = asset("storage/{$newPath}");
                    }
                }
            }

            // 🔁 Recurse through children
            if (isset($node['content']) && is_array($node['content'])) {
                $this->updateEditorImages($node['content'], $articleId);
            }
        }
    }

    function extractPreviewFromTiptap(array $content, $limit = 150)
    {
        foreach ($content['content'] as $node) {
            if ($node['type'] === 'paragraph') {
                $text = collect($node['content'] ?? [])
                    ->where('type', 'text')
                    ->pluck('text')
                    ->join('');

                return Str::limit($text, $limit);
            }
        }

        return null;
    }
}
