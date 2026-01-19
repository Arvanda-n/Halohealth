<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// 🔥 PASTIKAN MODEL DI-IMPORT
use App\Models\Message;
use App\Models\User;

class ChatController extends Controller
{
    // 1. KIRIM PESAN
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'receiver_id' => 'required',
                'message' => 'required'
            ]);

            $msg = Message::create([
                'sender_id' => Auth::id() ?: $request->user()->id, // Coba dua cara ambil ID
                'receiver_id' => $request->receiver_id,
                'message' => $request->message
            ]);

            return response()->json($msg, 201);

        } catch (\Exception $e) {
            // KIRIM ERROR KE FRONTEND
            return response()->json([
                'error' => 'Gagal Kirim Pesan',
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    // 2. AMBIL PESAN (GET MESSAGES)
    public function getMessages($userId)
    {
        try {
            // Cek Auth
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized: User tidak login'], 401);
            }
            $myId = $user->id;

            // Debugging: Cek apakah Model Message bisa diakses
            // Kalau ini error, berarti Model Message bermasalah
            if (!class_exists('App\Models\Message')) {
                throw new \Exception("Model App\Models\Message tidak ditemukan!");
            }

            // Query Pesan
            $messages = Message::where(function ($q) use ($userId, $myId) {
                $q->where('sender_id', $myId)->where('receiver_id', $userId);
            })->orWhere(function ($q) use ($userId, $myId) {
                $q->where('sender_id', $userId)->where('receiver_id', $myId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

            return response()->json($messages);

        } catch (\Exception $e) {
            // 🔥 INI DIA! TANGKAP ERRORNYA & KIRIM KE CONSOLE
            return response()->json([
                'status' => 'ERROR_DI_BACKEND', // Penanda
                'message' => $e->getMessage(),  // Pesan Error Asli (Misal: Column not found)
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 400); // Pakai 400 biar gak dianggap "Internal Server Error" sama browser
        }
    }

    // 3. HISTORY CHAT
    public function getChatHistory(Request $request)
    {
        try {
            $myId = Auth::id();
            $messages = Message::where('sender_id', $myId)
                ->orWhere('receiver_id', $myId)
                ->orderBy('created_at', 'desc')
                ->get();

            $grouped = $messages->groupBy(function ($msg) use ($myId) {
                return $msg->sender_id == $myId ? $msg->receiver_id : $msg->sender_id;
            });

            $history = [];
            foreach ($grouped as $partnerId => $msgs) {
                $partner = User::find($partnerId);
                if ($partner) {
                    $lastMsg = $msgs->first();
                    $history[] = [
                        'user_id' => $partner->id,
                        'name' => $partner->name,
                        'image' => $partner->image,
                        'last_message' => $lastMsg->message,
                        'created_at' => $lastMsg->created_at,
                        'unread_count' => 0
                    ];
                }
            }
            return response()->json($history);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}