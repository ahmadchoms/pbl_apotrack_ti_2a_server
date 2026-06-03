<?php

   namespace App\Events;

   use App\Models\User;
   use Illuminate\Foundation\Events\Dispatchable;
   use Illuminate\Queue\SerializesModels;

   class UserSuspensionChanged
   {
       use Dispatchable, SerializesModels;

       public $user;
       public $isActive;

       public function __construct(User $user, $isActive)
       {
           $this->user = $user;
           $this->isActive = $isActive;
       }
   }