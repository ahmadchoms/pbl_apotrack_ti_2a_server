<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'is_visible' => $this->is_visible,
            'created_at' => $this->created_at?->format('d M Y H:i'),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'avatar_url' => $this->user->avatar_url,
            ]),
        ];
    }
}
