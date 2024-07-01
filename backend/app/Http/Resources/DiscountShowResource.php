<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'discount' => $this->discount,
            'products' => $this->products->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name
                ];
            })
            

        ];
    }
}
