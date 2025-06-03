<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Siswa>
 */
class SiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $number = str_pad($this->faker->numberBetween(0, 99999), 5, '0', STR_PAD_LEFT);

        return [
            'nis'=> $number,
            'email'=> "{$number}@sija.com"
        ];
    }
}
