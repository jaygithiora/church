<?php

use App\Http\Controllers\APIs\AuthController;
use App\Http\Controllers\APIs\Dashboard\Articles\ArticleAPIController;
use App\Http\Controllers\APIs\Dashboard\Children\ChildrenAPIController;
use App\Http\Controllers\APIs\Dashboard\Children\ChildrenEventsAPIController;
use App\Http\Controllers\APIs\Dashboard\Communication\EmailsAPIController;
use App\Http\Controllers\APIs\Dashboard\Communication\ScheduleAPIController;
use App\Http\Controllers\APIs\Dashboard\Communication\SmsApiController;
use App\Http\Controllers\APIs\Dashboard\HomeAPIController;
use App\Http\Controllers\APIs\Dashboard\Profiles\ProfileAPIController;
use App\Http\Controllers\APIs\Dashboard\Children\ChildrenCheckinAPIController;
use App\Http\Controllers\APIs\Dashboard\Diary\DiaryAPIController;
use App\Http\Controllers\APIs\Dashboard\Events\EventsAPIController;
use App\Http\Controllers\APIs\Dashboard\Events\EventsAttendanceAPIController;
use App\Http\Controllers\APIs\Dashboard\Notices\NoticesAPIController;
use App\Http\Controllers\APIs\Dashboard\OrderOfServices\OrderOfServicesAPIController;
use App\Http\Controllers\APIs\Dashboard\People\PeopleAPIController;
use App\Http\Controllers\APIs\Dashboard\Settings\AgeGroupSettingsController;
use App\Http\Controllers\APIs\Dashboard\Settings\FundSourceSettingsController;
use App\Http\Controllers\APIs\Dashboard\Settings\GenderSettingsController;
use App\Http\Controllers\APIs\Dashboard\Users\RoleAPIController;
use App\Http\Controllers\APIs\Dashboard\Users\UsersAPIController;
use App\Http\Controllers\APIs\MpesaAPIController;
use App\Http\Controllers\APIs\Dashboard\Settings\PaymentModeSettingsController;
use App\Http\Controllers\APIs\Dashboard\Spiritual\PrayersAPIController;
use App\Http\Controllers\APIs\Dashboard\Spiritual\SermonsAPIController;
use App\Http\Controllers\APIs\Dashboard\Spiritual\TestimonialsAPIController;
use Illuminate\Support\Facades\Route;

Route::any('test/sms', [MpesaAPIController::class, 'testSMS']);
Route::post('/access/token', [MpesaAPIController::class, 'generateAccessToken']);
Route::post('/stk/push',  [MpesaAPIController::class, 'customerMpesaSTKPush']);
Route::post('stk/confirmation',  [MpesaAPIController::class, 'stkResponse']);
Route::post('/validation',  [MpesaAPIController::class, 'mpesaValidation']);
Route::post('/transaction/confirmation',  [MpesaAPIController::class, 'mpesaConfirmation']);
Route::post('/register/url',  [MpesaAPIController::class, 'mpesaRegisterUrls']);


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::group(['prefix' => 'dashboard', 'middleware' => 'auth:sanctum'], function () {
    Route::get('home', [HomeAPIController::class, 'getDashboard']);
    //order of services
    Route::get("diaries", [DiaryAPIController::class, "index"]);
    Route::post("diaries/add", [DiaryAPIController::class, "addDiary"]);
    Route::get("diaries/view/{id}", [DiaryAPIController::class, "getDiary"]);
    //order of services
    Route::get("order-of-services", [OrderOfServicesAPIController::class, "index"]);
    Route::post("order-of-services/add", [OrderOfServicesAPIController::class, "addOrderOfService"]);
    Route::get("order-of-services/view/{id}", [OrderOfServicesAPIController::class, "getOrderOfService"]);
    //notices
    Route::get("notices", [NoticesAPIController::class, "index"]);
    Route::post("notices/add", [NoticesAPIController::class, "addNotice"]);
    Route::get("notices/view/{id}", [NoticesAPIController::class, "getNotice"]);
    //events
    Route::get("events", [EventsAPIController::class, "index"]);
    Route::post("events/add", [EventsAPIController::class, "addEvent"]);
    Route::get("events/view/{id}", [EventsAPIController::class, "getEvent"]);
    Route::get("events/attendances", [EventsAttendanceAPIController::class,"index"]);
    Route::post("events/attendances/add", [EventsAttendanceAPIController::class, "addAttendance"]);
    //people 
    Route::get("people",[PeopleAPIController::class, "index"]);
    Route::get("people/view/{id}",[PeopleAPIController::class, "getPerson"]);
    Route::post("people/add", [PeopleAPIController::class, "addPerson"]);
    Route::get("people/members/view/{id}", [PeopleAPIController::class, "getPersonMembers"]);
    Route::get("people/members", [PeopleAPIController::class, "getMembers"]);
    Route::post("people/members/delete", [PeopleAPIController::class, "deleteMember"]);
    Route::post("people/members/add", [PeopleAPIController::class, "addMembers"]);

    //children
    Route::get('children', [ChildrenAPIController::class, 'index']);
    Route::get('children/view/{id}', [ChildrenAPIController::class, 'getChild']);
    Route::post('children/add', [ChildrenAPIController::class, 'addChild']);

    Route::get('children/events', [ChildrenEventsAPIController::class, 'index']);
    Route::post('children/events/add', [ChildrenEventsAPIController::class, 'addChildEvent']);

    Route::get('children/checkins', [ChildrenCheckinAPIController::class, 'index']);
    Route::post('children/checkins/add', [ChildrenCheckinAPIController::class, 'addChildCheckin']);
    Route::get('children/checkins/view/{id}', [ChildrenCheckinAPIController::class, 'childCheckIn']);

    //Spiritual
    Route::get('spiritual/sermons', [SermonsAPIController::class, 'index']);
    Route::get('spiritual/sermons/view/{id}', [SermonsAPIController::class, 'getSermon']);
    Route::post('spiritual/sermons/add', [SermonsAPIController::class, 'addSermon']);

    Route::get('spiritual/prayers', [PrayersAPIController::class, 'index']);
    Route::get('spiritual/prayers/view/{id}', [PrayersAPIController::class, 'getPrayer']);
    Route::post('spiritual/prayers/add', [PrayersAPIController::class, 'addPrayer']);

    Route::get('spiritual/testimonials', [TestimonialsAPIController::class, 'index']);
    Route::get('spiritual/testimonials/view/{id}', [TestimonialsAPIController::class, 'getTestimonial']);
    Route::post('spiritual/testimonials/add', [TestimonialsAPIController::class, 'addTestimonial']);

    //communication
    Route::get('emails', [EmailsAPIController::class, 'index']);
    Route::get('emails/view{id}', [EmailsAPIController::class, 'getEmail']);
    Route::post('emails/add', [EmailsAPIController::class, 'addEmail']);

    Route::get('smses', [SmsApiController::class, 'index']);
    Route::get('smses/view/{id}', [SmsApiController::class, 'getSms']);
    Route::post('smses/add', [SmsApiController::class, 'addSms']);

    Route::get('schedules', [ScheduleAPIController::class, 'index']);
    Route::get('schedules/view/{id}', [ScheduleAPIController::class, 'getSchedule']);
    Route::post('schedules/add', [ScheduleAPIController::class, 'addSchedule']);

    //article
    Route::get('articles', [ArticleAPIController::class, 'index']);
    Route::post('articles/upload', [ArticleAPIController::class, 'upload']);
    Route::post('articles/add', [ArticleAPIController::class, 'addArticle']);
    Route::get('articles/view/{id}', [ArticleAPIController::class, 'getArticle']);

    //settings
    Route::get('settings/payment_modes', [PaymentModeSettingsController::class, 'index']);
    Route::post('settings/payment_modes/add', [PaymentModeSettingsController::class, 'addPaymentMode']);

    Route::get('settings/fund_sources', [FundSourceSettingsController::class, 'index']);
    Route::post('settings/fund_sources/add', [FundSourceSettingsController::class, 'addFundSource']);

    Route::get('settings/genders', [GenderSettingsController::class, 'index']);
    Route::post('settings/genders/add', [GenderSettingsController::class, 'addGender']);

    Route::get('settings/age_groups', [AgeGroupSettingsController::class, 'index']);
    Route::post('settings/age_groups/add', [AgeGroupSettingsController::class, 'addAgeGroup']);

    //users
    Route::get("users", [UsersAPIController::class, "index"]);
    Route::post("users/add", [UsersAPIController::class, "addUser"]);
    //roles
    Route::get("roles", [RoleAPIController::class, "index"]);
    Route::post("roles/add", [RoleAPIController::class, "addRole"]);
    Route::get("roles/view/{id}", [RoleAPIController::class, "role"]);
    Route::post("roles/permissions/add", [RoleAPIController::class, "addPermissions"]);

    Route::get('profile', [AuthController::class, 'user']);
    Route::post("profile/edit", [ProfileAPIController::class, "editProfile"]);
    Route::post("profile/password/update", [ProfileAPIController::class, "changePassword"]);
    Route::post('logout', [AuthController::class, 'logout']);
});
