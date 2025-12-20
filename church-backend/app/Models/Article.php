<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;


class Article extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title', 'content', 'description', 'banner', 'user_id', 'status', 'article_date'];
     protected $casts = [
        'content' => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::creating(function ($article) {

            // 1️⃣ Create base title
            if (empty($article->title)) {
                if (!empty($article->description)) {
                    $baseTitle = Str::slug(
                        Str::limit(strip_tags($article->description), 60, '')
                    );
                } else {
                    $baseTitle = 'article';
                }
            } else {
                $baseTitle = Str::slug($article->title);
            }

            // 2️⃣ Ensure uniqueness
            $article->title = static::generateUniqueTitle($baseTitle);
        });
    }

    protected static function generateUniqueTitle(string $baseTitle): string
    {
        $title = $baseTitle;
        $count = 1;

        while (
            static::withTrashed()
                ->where('title', $title)
                ->exists()
        ) {
            $title = $baseTitle . '-' . $count;
            $count++;
        }

        return $title;
    }

}
