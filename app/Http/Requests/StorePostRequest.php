<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'is_draft' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * Show error message
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judulnya diisi dong, masa kosong kayak hati aku.. 🥺',
            'title.max' => 'Judulnya kepanjangan bro, singkat padat aja biar nggak capek bacanya.',
            'content.required' => 'Tulis sesuatu lah, konten nggak boleh sepi kayak kuburan.',
            'is_draft.required' => 'Statusnya jangan digantung, mau jadi draft atau publish?',
            'published_at.date' => 'Format tanggalnya yang bener ya, jangan kayak janjian yang fiktif.',
        ];
    }
}
