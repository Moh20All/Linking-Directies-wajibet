export interface Translation {
  // Navigation & Common
  dashboard: string
  settings: string
  logout: string
  welcome: string
  loading: string
  gettingReady: string

  // Login Page
  welcomeTo: string
  directis360: string
  streamlinedDashboards: string
  signIn: string
  accessDashboard: string
  identificator: string
  enterIdentificator: string
  password: string
  enterPassword: string
  signingIn: string
  headmasterUpgrade: string
  joinUs: string

  // Role Selection
  selectRole: string
  accessDashboard2: string
  needHelp: string
  contactAdmin: string
  viewDocumentation: string

  // Roles
  bossHeadmaster: string
  bossHeadmasterDesc: string
  staffAdmin: string
  staffAdminDesc: string
  teacher: string
  teacherDesc: string
  student: string
  studentDesc: string
  parent: string
  parentDesc: string

  // Features
  createAdminAccounts: string
  setTabPasswords: string
  viewAnalytics: string
  manageSchoolSettings: string
  pedagogyManagement: string
  financeTracking: string
  attendanceMonitoring: string
  assetsManagement: string
  manageStudentGroups: string
  enterGrades: string
  markAttendance: string
  viewSchedule: string
  viewGrades: string
  checkSchedule: string
  groupInformation: string
  communityAccess: string
  childProgress: string
  paymentTracking: string
  busTracking: string
  receiveAlerts: string

  // Header
  welcomeBack: string
  thisIsYourDashboard: string
  refreshingData: string
  signedInAs: string

  // Sidebar
  managementSystem: string

    // ===== Admin Management Page =====
    adminManagementTitle: string
    adminManagementDesc: string
    addAdmin: string
    adminStaffMembers: string
    adminStaffMembersDesc: string
    fullName: string
    username: string
    email: string
    phone: string
    createdAt: string
    actions: string
    loadingAdminData: string
    noAdminsFound: string
    successTitle: string
    createNewAdmin: string
    editAdmin: string
    createNewAdminDesc: string
    editAdminDesc: string
    leaveBlank: string
    phoneNumber: string
    cancel: string
    createAdmin: string
    saveChanges: string
    adminCreated: string
    adminUpdated: string
    passwordTooShort: string
    newPasswordTooShort: string
    authFailed: string
    unknownError: string

// ===== Tab Password Manager Page =====
tabPasswordManagementTitle: string
tabPasswordManagementDesc: string
success: string
passwordUpdated: string
loadingPasswordSettings: string
passwordStatus: string
passwordStatusCount: string
configured: string

// Tab names & descriptions
tabPedagogy: string
tabPedagogyDesc: string
tabFinance: string
tabFinanceDesc: string
tabAttendance: string
tabAttendanceDesc: string
tabAssets: string
tabAssetsDesc: string

// Status labels
set: string
notSet: string

// Buttons
updatePassword: string
setPassword: string

// Important notice
importantLabel: string
importantNotice: string

// Dialog
setPasswordFor: string
updatePasswordFor: string
createPasswordDesc: string
updatePasswordDesc: string
newPassword: string
confirmPassword: string
enterPasswordPlaceholder: string
confirmPasswordPlaceholder: string

// Errors
passwordCannotBeEmpty: string
passwordTooShort4: string
passwordsNotMatch: string
authTokenNotFound: string
couldNotLoadStatuses: string


// ===== Analytics Dashboard Page =====
financialSummary: string
financialSummaryDesc: string
totalIncome: string
totalExpenses: string
netProfit: string
goToFinanceDashboard: string

academicPerformanceTitle: string
academicPerformanceDesc: string
level: string
speciality: string
studentCount: string
averageGrade: string
gradeOutOf: string

schoolVitals: string
activeGroups: string
unassignedStudents: string

attendanceLast30Days: string
workerAttendance: string
studentAbsenceHotspots: string
absences: string

topTeachers: string
topTeachersDesc: string
groups: string


// ===== Add Asset Page =====
addAsset: string
addNewAssets: string
addAssetsDesc: string
adding: string
addAssetSingle: string
addAssetMultiple: string

essentialInfo: string
essentialInfoDesc: string
assetName: string
assetNamePlaceholder: string
category: string
selectCategory: string
location: string
selectLocation: string
quantity: string
ownership: string
ownershipSchool: string
ownershipLeased: string
ownershipDonated: string
ownershipBorrowed: string

multipleAssetsLabel: string
multipleAssetsDesc: string

optionalDetails: string
optionalDetailsDesc: string
serialNumber: string
serialNumberPlaceholder: string
purchaseDate: string
purchasePrice: string
totalCost: string
description: string
descriptionPlaceholder: string

toastSuccess: string
failedAddAsset: string


// ===== Asset Categories Page =====
assetCategories: string
assetCategoriesDesc: string
searchCategoriesAssets: string

items: string
totalValue: string
activeLabel: string
schoolOwnedLabel: string
recentItems: string
moreItems: string

noCategories: string
noAssetsYet: string
tryAdjustSearch: string

categoryAssets: string
categorySummary: string

summaryActive: string
summaryGoodCondition: string
summaryNeedAttention: string
summarySchoolOwned: string

value: string
assignedTo: string
serial: string

conditionExcellent: string
conditionGood: string
conditionFair: string
conditionPoor: string
conditionNeedsRepair: string

statusActive: string
statusInactive: string
statusMaintenance: string
statusDisposed: string


// ===== Assets Overview Page =====
totalAssets: string
activeAssets: string

depreciation: string
maintenanceAlerts: string
overdueTasks: string

assetConditionDistribution: string

recentActivities: string
maintenanceCompleted: string
newAssetAdded: string
completed: string
added: string
noRecentActivities: string


// ===== Assets Settings Page =====
settingsSaved: string

generalSettings: string
generalSettingsDesc: string
defaultDepRate: string
annualDepRateHint: string
maintenanceReminder: string
maintenanceReminderHint: string
lowValueThreshold: string
lowValueThresholdHint: string
defaultMaintenanceInterval: string
defaultMaintenanceIntervalHint: string

autoUpdateValues: string
autoUpdateValuesDesc: string
maintenanceAlertsDesc: string
lowValueTracking: string
lowValueTrackingDesc: string
barcodeScanning: string
barcodeScanningDesc: string
assetTransfers: string
assetTransfersDesc: string
disposalApproval: string
disposalApprovalDesc: string
saveSettings: string


addCategory: string
active: string
inactive: string
depRate: string
annually: string
maintenanceInterval: string
months: string
deactivate: string
activate: string
addCategoriesHint: string

dataManagement: string
dataManagementDesc: string
exportData: string
importData: string
dataNotice: string
dataNoticeDesc: string

addAssetCategory: string
addAssetCategoryDesc: string
categoryName: string
categoryDescription: string
depRatePercent: string
maintenanceIntervalMonths: string


placeholderCategoryName: string
placeholderCategoryDesc: string

editAssetCategory: string
editAssetCategoryDesc: string

alertEnterCategoryName: string
alertDeleteCategoryConfirm: string
alertImportSuccess: string
alertImportError: string

maintenanceAlerts1: string
maintenanceAlertsDesc1: string
assetCategoriesDesc1: string
noCategories1: string



  inventory_title: string;
  inventory_description: string;
  refresh: string;
  add_asset: string;
  search_assets: string;
  all_categories: string;
  all_conditions: string;
  all_statuses: string;
  no_assets_found: string;
  try_adjusting_filters: string;
  view: string;
  edit: string;
  delete: string;
  confirm_delete_asset: string;
  asset_details_category: string;
  asset_details_location: string;
  asset_details_serial: string;
  asset_details_purchase_date: string;
  asset_details_purchase_price: string;
  asset_details_ownership: string;
  add_new_asset: string;
  edit_asset: string;
  asset_name: string;
  asset_category: string;
  asset_location: string;
  asset_serial_number: string;
  asset_purchase_date: string;
  asset_purchase_price: string;
  asset_condition: string;
  asset_status: string;
  asset_ownership: string;
  ownership_school_owned: string;
  ownership_leased: string;
  ownership_donated: string;
  ownership_borrowed: string;
  condition_excellent: string;
  condition_good: string;
  condition_fair: string;
  condition_poor: string;
  condition_needs_repair: string;
  status_active: string;
  status_inactive: string;
  status_maintenance: string;
  status_disposed: string;
  save: string;



  maint_title: string;
  maint_desc: string;
  maint_new_btn: string;
  maint_filters_status: string;
  maint_filters_type: string;
  maint_filters_priority: string;
  maint_no_records: string;

  maint_status_all: string;
  maint_status_scheduled: string;
  maint_status_inprogress: string;
  maint_status_completed: string;
  maint_status_overdue: string;

  maint_type_all: string;
  maint_type_routine: string;
  maint_type_repair: string;
  maint_type_inspection: string;

  maint_priority_all: string;
  maint_priority_low: string;
  maint_priority_medium: string;
  maint_priority_high: string;
  maint_priority_urgent: string;

  maint_schedule_title: string;
  maint_edit_title: string;
  maint_asset_label: string;
  maint_asset_placeholder: string;
  maint_date_label: string;
  maint_type_label: string;
  maint_type_placeholder: string;
  maint_priority_label: string;
  maint_priority_placeholder: string;
  maint_description_label: string;
  maint_description_placeholder: string;

  maint_btn_cancel: string;
  maint_btn_save: string;
  maint_btn_edit: string;
  maint_btn_delete: string;



  search_assets_title: string;
  search_assets_desc: string;
  search_assets_placeholder: string;
  search_assets_filters_btn: string;
  search_assets_export_btn: string;

  search_assets_adv_filters: string;
  search_assets_clear_all: string;

  search_assets_category_label: string;
  search_assets_condition_label: string;
  search_assets_status_label: string;
  search_assets_location_label: string;
  search_assets_price_label: string;
  search_assets_date_label: string;
  search_assets_assigned_label: string;

  search_assets_category_all: string;
  search_assets_condition_all: string;
  search_assets_status_all: string;
  search_assets_location_all: string;
  search_assets_price_all: string;
  search_assets_date_all: string;

  search_assets_condition_excellent: string;
  search_assets_condition_good: string;
  search_assets_condition_fair: string;
  search_assets_condition_poor: string;
  search_assets_condition_needsrepair: string;

  search_assets_status_active: string;
  search_assets_status_inactive: string;
  search_assets_status_maintenance: string;
  search_assets_status_disposed: string;

  search_assets_price_under100: string;
  search_assets_price_100_500: string;
  search_assets_price_500_1000: string;
  search_assets_price_1000_5000: string;
  search_assets_price_over5000: string;

  search_assets_date_lastmonth: string;
  search_assets_date_last3months: string;
  search_assets_date_last6months: string;
  search_assets_date_lastyear: string;
  search_assets_date_overyear: string;

  search_assets_results_found: string;
  search_assets_results_value: string;

  search_assets_no_results_title: string;
  search_assets_no_results_empty: string;
  search_assets_no_results_try: string;
  search_assets_clear_btn: string;

  search_assets_details_title: string;
  search_assets_details_desc: string;

  search_assets_details_name: string;
  search_assets_details_category: string;
  search_assets_details_condition: string;
  search_assets_details_status: string;
  search_assets_details_location: string;
  search_assets_details_assigned: string;
  search_assets_details_purchase_date: string;
  search_assets_details_purchase_price: string;
  search_assets_details_current_value: string;
  search_assets_details_serial: string;
  search_assets_details_manufacturer: string;
  search_assets_details_model: string;
  search_assets_details_warranty: string;
  search_assets_details_last_maintenance: string;
  search_assets_details_next_maintenance: string;
  search_assets_details_notes: string;
  search_assets_results_found_asset: string;
  search_assets_details_purchased: string;



  attendance_overview_title: string;
  attendance_overview_desc: string;

  attendance_select_date: string;
  attendance_department_label: string;
  attendance_all_departments: string;
  attendance_export_btn: string;
  attendance_exporting_btn: string;

  attendance_loading: string;

  attendance_daily_stats: string;
  attendance_stat_total: string;
  attendance_stat_present: string;
  attendance_stat_absent: string;
  attendance_stat_late: string;
  attendance_stat_justified: string;
  attendance_stat_holiday_rest: string;
  attendance_stat_unmarked: string;

  attendance_department_breakdown: string;
  attendance_department_rate: string;
  attendance_no_department_data: string;

  attendance_records_day: string;
  attendance_no_records: string;
  attendance_unmarked_member: string;

  attendance_status_present: string;
  attendance_status_absent: string;
  attendance_status_late: string;
  attendance_status_justified: string;
  attendance_status_holiday: string;
  attendance_status_rest: string;
  attendance_status_unknown: string;

  attendance_pdf_title: string;
  attendance_pdf_date: string;
  attendance_pdf_department: string;
  attendance_pdf_generated: string;
  attendance_pdf_headers_name: string;
  attendance_pdf_headers_department: string;
  attendance_pdf_headers_role: string;
  attendance_pdf_headers_status: string;
  attendance_pdf_headers_time: string;
  attendance_pdf_headers_remarks: string;
  attendance_pdf_no_data: string;



  tracking_daily_progress_title: string;
  tracking_daily_progress_desc: string;

  tracking_total_staff: string;
  tracking_marked: string;
  tracking_unmarked: string;
  tracking_completion: string;

  tracking_attendance_title: string;
  tracking_attendance_desc: string;
  tracking_select_date: string;
  tracking_search_staff: string;
  tracking_search_placeholder: string;
  tracking_department: string;
  tracking_all_departments: string;
  tracking_filter_placeholder: string;

  tracking_save_btn: string;
  tracking_saving_btn: string;

  tracking_staff_list: string;
  tracking_loading_records: string;

  tracking_status_label: string;
  tracking_showing_time: string;

  tracking_no_staff_found: string;
  tracking_no_staff_filter: string;

  tracking_status_present: string;
  tracking_status_absent: string;
  tracking_status_late: string;
  tracking_status_justified: string;
  tracking_status_holiday: string;
  tracking_status_rest: string;
  tracking_status_not_marked: string;
  tracking_status_unknown: string;

  tracking_auth_missing: string;
  tracking_fetch_error: string;
  tracking_save_success: string;
  tracking_save_error: string;
  back_to_staff_roles: string;
  retry: string;
  error: string;
  loading_asset_data: string;
  loading_staff_members: string;
  loading_finance_data: string;

  loading_overview: string;
  error_loading_dashboard: string;
  coming_soon: string;
  this_section_is_under_construction: string;


  parent_account: string;
  children: string;
  active_account: string;
  children_overview: string;
  quick_overview_of_your_children_academic_performance: string;
  overall_grade: string;
  absences_lates: string;
  view_full_details: string;
  overall_average: string;
  lates: string;
  teachers: string;
  full_report_for: string;
  academic_marks: string;
  trimester: string;
  coefficient: string;
  dev1: string;
  dev2: string;
  exam: string;
  weekly_schedule: string;
  attendance_details: string;
  no_absences_or_lates_recorded: string;



  request_a_meeting: string;
  select_teacher: string;
  academic_performance: string;
  behavioral_issues: string;
  attendance_issues: string;
  health_and_wellbeing: string;
  administrative_request: string;
  extracurricular_activities: string;
  general_follow_up: string;
  conflict_resolution: string;
  date: string;
  notes: string;
  send_request: string;
  your_meetings: string;
  cause: string;
  requested: string;
  scheduled: string;
  confirm_new_date: string;
  decline_reschedule: string;
  no_meetings_found: string;
  optional: string;
  refreshing_data: string;


  staff_dashboard_title: string;
  staff_dashboard_loading: string;

  staff_overview_title: string;
  staff_overview_desc: string;
  staff_overview_fullname: string;
  staff_overview_role: string;
  staff_overview_phone: string;
  staff_overview_school: string;

  staff_active_tab_title: string;
  staff_active_tab_desc: string;
  staff_active_tab_unlocked: string;
  staff_active_tab_none: string;
  staff_active_tab_hint: string;
  staff_active_tab_go: string;
  staff_active_tab_revoke: string;

  staff_tab_access_granted_title: string;
  staff_tab_access_granted_desc: string;
  staff_tab_access_btn_go: string;
  staff_tab_access_btn_revoke: string;

  staff_tab_locked_message: string;
  staff_tab_password_placeholder: string;
  staff_tab_password_error: string;
  staff_tab_password_failed: string;
  staff_tab_btn_unlock: string;
  staff_tab_btn_verifying: string;
  section: string;
  staff_tab_manage_tasks: string;
  staff_tab_related_tasks: string;



  staffrole_back_btn: string
  staffrole_header_title: string
  staffrole_header_subtitle: string

  staffrole_password_status_title: string
  staffrole_password_status_count_prefix: string
  staffrole_password_status_count_suffix: string
  staffrole_password_status_missing: string

  staffrole_pedagogy_desc: string
  staffrole_pedagogy_feature1: string
  staffrole_pedagogy_feature2: string
  staffrole_pedagogy_feature3: string
  staffrole_pedagogy_feature4: string

  staffrole_finance_desc: string
  staffrole_finance_feature1: string
  staffrole_finance_feature2: string
  staffrole_finance_feature3: string
  staffrole_finance_feature4: string

  staffrole_attendance_desc: string
  staffrole_attendance_feature1: string
  staffrole_attendance_feature2: string
  staffrole_attendance_feature3: string
  staffrole_attendance_feature4: string

  staffrole_assets_desc: string
  staffrole_assets_feature1: string
  staffrole_assets_feature2: string
  staffrole_assets_feature3: string
  staffrole_assets_feature4: string

  staffrole_protected: string
  staffrole_no_password: string

  staffrole_btn_access_prefix: string
  staffrole_btn_access_suffix: string
  staffrole_btn_password_required: string

  staffrole_footer_question: string
  staffrole_footer_contact: string

  staffrole_dialog_title_prefix: string
  staffrole_dialog_title_suffix: string
  staffrole_dialog_desc: string
  staffrole_dialog_password_label: string
  staffrole_dialog_password_placeholder: string
  staffrole_dialog_error_notset: string
  staffrole_dialog_error_required: string
  staffrole_dialog_error_incorrect: string

  staffrole_dialog_btn_cancel: string
  staffrole_dialog_btn_access: string
  staffrole_dialog_btn_verifying: string
  real_time_school_data: string


  studentcomm_feed_title: string
  studentcomm_feed_subtitle: string

  studentcomm_btn_refresh: string
  studentcomm_sorting_prefix: string
  studentcomm_sort_newest: string
  studentcomm_sort_oldest: string

  studentcomm_filter_placeholder: string
  studentcomm_filter_all: string

  studentcomm_error_title: string
  studentcomm_error_msg_prefix: string
  studentcomm_error_btn: string

  studentcomm_noposts_title: string
  studentcomm_noposts_desc: string

  studentcomm_post_by_prefix: string
  studentcomm_post_attachments: string
  studentcomm_post_view_replies_prefix: string
  studentcomm_post_view_replies_suffix: string

  studentcomm_reply_you: string
  studentcomm_reply_teacher: string
  studentcomm_reply_student: string
  studentcomm_reply_author: string
  studentcomm_reply_with_files: string
  studentcomm_badge_headmaster: string

  studentcomm_reply_placeholder_enabled: string
  studentcomm_reply_placeholder_disabled: string

  studentcomm_replyfile_remove: string





  studentdash_loading: string
  studentdash_error_title: string
  studentdash_error_msg_prefix: string
  studentdash_sidebar_overview: string
  studentdash_sidebar_grades: string
  studentdash_sidebar_schedule: string
  studentdash_sidebar_group: string
  studentdash_sidebar_community: string
  studentdash_sidebar_profile: string
  studentdash_header: string

  // Overview
  studentdash_overview_grade: string
  studentdash_overview_attendance: string
  studentdash_overview_subjects: string
  studentdash_overview_recentgrades: string
  studentdash_overview_nogrades: string
  studentdash_overview_todaysschedule: string
  studentdash_overview_noschedule: string

  // Grades tab
  studentdash_grades_title: string
  studentdash_grades_subtitle: string
  studentdash_grades_trimester_prefix: string
  studentdash_grades_trimester_performance_prefix: string
  studentdash_grades_average: string
  studentdash_grades_coeff: string
  studentdash_grades_finalgrade: string
  studentdash_grades_obs: string
  studentdash_grades_dev1: string
  studentdash_grades_dev2: string
  studentdash_grades_exam: string

  // Schedule
  studentdash_schedule_title: string
  studentdash_schedule_subtitle: string

  // Group
  studentdash_group_title: string
  studentdash_group_subtitle: string
  studentdash_group_level: string
  studentdash_group_season: string
  studentdash_group_yourteachers: string
  studentdash_group_subject: string

  // Profile
  studentdash_profile_title: string
  studentdash_profile_subtitle: string
  studentdash_profile_personalinfo: string
  studentdash_profile_academicinfo: string
  studentdash_profile_parentinfo: string

  // Profile fields
  studentdash_profile_fullname: string
  studentdash_profile_email: string
  studentdash_profile_phone: string
  studentdash_profile_birthdate: string
  studentdash_profile_birthcity: string
  studentdash_profile_nationality: string
  studentdash_profile_schooltype: string
  studentdash_profile_currentgroup: string
  studentdash_profile_level: string
  studentdash_profile_speciality: string

  // Parent info
  studentdash_parent_mother: string
  studentdash_parent_father: string
  studentdash_parent_notavail_mother: string
  studentdash_parent_notavail_father: string
  Coeff: string



  BTN_CREATE_POST: string;
  DIALOG_CREATE_TITLE: string;
  DIALOG_CREATE_DESC: string;
  INPUT_POST_TITLE: string;
  INPUT_POST_CONTENT: string;
  LABEL_VISIBLE_GROUPS: string;
  LABEL_ATTACH_FILES: string;
  UPLOAD_CLICK: string;
  BTN_POST: string;
  BTN_POSTING: string;

  POST_EDIT: string;
  POST_EDIT_TITLE: string;
  POST_EDIT_DESC: string;
  POST_EDIT_FIELD_TITLE: string;
  POST_EDIT_FIELD_CONTENT: string;
  POST_EDIT_VISIBLE_GROUPS: string;
  POST_EDIT_CANCEL: string;
  POST_EDIT_SAVE: string;
  POST_EDIT_SAVING: string;

  POST_BY: string;
  POST_SELECTED_GROUPS: string;
  POST_ATTACHMENTS: string;
  POST_VIEW_REPLIES: string;
  POST_REPLY_PLACEHOLDER: string;
  POST_REPLY_YOU: string;
  POST_REPLY_TEACHER: string;
  POST_REPLY_STUDENT: string;
  POST_REPLY_AUTHOR: string;
  POST_REPLY_DOWNLOAD_TITLE: string;

  FEED_TITLE: string;
  FEED_DESC: string;
  FEED_REFRESH: string;
  FEED_ERROR_TITLE: string;
  FEED_ERROR_DESC: string;
  FEED_TRY_AGAIN: string;
  FEED_NO_POSTS_TITLE: string;
  FEED_NO_POSTS_DESC: string;
  FEED_BTN_ALL: string;
  FEED_BTN_MINE: string;
  FEED_SORT_NEWEST: string;
  FEED_SORT_OLDEST: string;
  POST_VIEW_REPLIES_COUNT: string;





  teacher_dashboard_title: string;
  teacher_dashboard_refresh: string;
  teacher_dashboard_loading: string;
  teacher_dashboard_failed_title: string;
  teacher_dashboard_failed_login: string;
  teacher_dashboard_refreshing: string;

  teacher_overview_tab: string;
  teacher_groups_tab: string;
  teacher_grades_tab: string;
  teacher_attendance_tab: string;
  teacher_schedule_tab: string;
  teacher_community_tab: string;
  teacher_meetings_tab: string;
  teacher_profile_tab: string;

  teacher_total_groups1: string;
  teacher_total_students1: string;
  teacher_subjects1: string;
  teacher_weeks_classes: string;
  teacher_todays_classes: string;
  teacher_no_classes_today: string;

  teacher_groups_manage: string;
  teacher_groups_students_count: string;
  teacher_groups_view_details1: string;

  teacher_grades_manage: string;
  teacher_grades_description: string;
  teacher_grades_trimester1: string;
  teacher_grades_trimester2: string;
  teacher_grades_trimester3: string;
  teacher_grades_enter: string;
  teacher_grades_view_report: string;

  teacher_attendance_manage: string;
  teacher_attendance_description: string;
  teacher_attendance_mark: string;

  teacher_schedule_title: string;
  teacher_schedule_description: string;

  teacher_profile_refresh: string;
  teacher_profile_contact_admin: string;
  teacher_profile_modules: string;
  teacher_profile_no_modules: string;
  teacher_profile_current_groups: string;
  teacher_profile_no_groups: string;
  teacher_profile_history: string;

  teacher_groupdetails_title: string;
  teacher_groupdetails_info: string;
  teacher_groupdetails_students: string;
  teacher_groupdetails_subject: string;
  teacher_groupdetails_level: string;
  teacher_groupdetails_academic_year: string;
  teacher_groupdetails_statistics: string;
  teacher_groupdetails_distribution_excellent: string;
  teacher_groupdetails_distribution_good: string;
  teacher_groupdetails_distribution_average: string;
  teacher_groupdetails_distribution_needs: string;
  teacher_groupdetails_attendance_presence: string;
  teacher_groupdetails_attendance_lateness: string;
  teacher_groupdetails_attendance_absence: string;
  teacher_groupdetails_student_list: string;
  teacher_groupdetails_student_list_desc: string;
  teacher_groupdetails_status_active: string;
  teacher_groupdetails_quick_actions: string;
  teacher_groupdetails_export: string;

  teacher_modal_grades_title: string;
  teacher_modal_grades_description: string;
  teacher_modal_grades_close: string;
  teacher_modal_loading: string;

  teacher_attendance_modal_title: string;
  teacher_attendance_modal_description: string;
  teacher_attendance_modal_mark: string;
  teacher_attendance_modal_error: string;
  teacher_attendance_modal_success: string;

  teacher_todays_schedule: string;
  teacher_students: string;
  teacher_grades_class_average: string;
  teacher_username: string;
  teacher_national_id: string;
  teacher_modal_grades_module: string;
  teacher_student_name: string;
  teacher_constant_observation: string;
  teacher_modal_grades_loading: string;
  teacher_modal_grades_description1: string;
  Loading_Group_Details: string;
  teacher_groupdetails_group_name: string;
  teacher_groupdetails_active_students: string;
  teacher_groupdetails_grade_distribution: string;
  teacher_groupdetails_attendance_overview: string;
  teacher_groupdetails_class: string;
  teacher_session: string;
  teacher_select_session: string;
  teacher_notes_optional: string;
  Save_Attendance: string;




  teacher_dash_title: string;
  teacher_active_status: string;

  teacher_total_groups: string;
  teacher_total_students: string;
  teacher_subjects: string;
  teacher_today_classes: string;
  teacher_today_schedule: string;

  teacher_groups_tab_title: string;
  teacher_groups_tab_desc: string;
  teacher_groups_students_label: string;
  teacher_groups_view_details: string;

  teacher_grades_tab_title: string;
  teacher_grades_tab_desc: string;
  teacher_grades_class_avg: string;
  teacher_grades_enter_btn: string;
  teacher_grades_view_report_btn: string;

  teacher_attendance_tab_title: string;
  teacher_attendance_tab_desc: string;
  teacher_attendance_select_date: string;
  teacher_attendance_selected_prefix: string;
  teacher_attendance_selected_suffix: string;
  teacher_attendance_for_date: string;
  teacher_attendance_mark_btn: string;
  teacher_attendance_view_report_btn: string;
  teacher_attendance_present: string;
  teacher_attendance_absent: string;
  teacher_attendance_late: string;
  teacher_attendance_excused: string;
  teacher_attendance_notes_label: string;
  teacher_attendance_notes_placeholder: string;
  teacher_attendance_save_btn: string;

  teacher_schedule_tab_title: string;
  teacher_schedule_tab_desc: string;

  teacher_community_title: string;
  teacher_community_desc: string;
  teacher_community_coming: string;
  teacher_community_subdesc: string;

  teacher_settings_title: string;
  teacher_settings_desc: string;
  teacher_settings_personal_info: string;
  teacher_settings_professional_info: string;
  teacher_settings_account_actions: string;
  teacher_settings_change_password: string;
  teacher_settings_update_profile: string;
  teacher_settings_contact_admin: string;

  teacher_modal_grades_title_prefix: string;
  teacher_modal_grades_title_suffix: string;
  teacher_modal_grades_desc: string;
  teacher_modal_student_name: string;
  teacher_modal_const_obs: string;
  teacher_modal_dev1: string;
  teacher_modal_dev2: string;
  teacher_modal_exam: string;
  teacher_modal_final_grade: string;
  teacher_modal_actions: string;
  teacher_modal_cancel: string;
  teacher_modal_save_all: string;

  teacher_modal_attendance_title_prefix: string;
  teacher_modal_attendance_title_suffix: string;
  teacher_modal_attendance_desc: string;
  teacher_modal_attendance_class: string;
  teacher_modal_attendance_date: string;
  teacher_modal_attendance_subject: string;
  teacher_modal_attendance_present: string;
  teacher_modal_attendance_absent: string;
  teacher_modal_attendance_total: string;
  teacher_modal_attendance_close: string;

  teacher_modal_report_title_prefix: string;
  teacher_modal_report_title_suffix: string;
  teacher_modal_report_desc: string;
  teacher_modal_report_total_students: string;
  teacher_modal_report_class_avg: string;
  teacher_modal_report_attendance_rate: string;
  teacher_modal_report_pass_rate: string;
  teacher_modal_report_distribution: string;
  teacher_modal_report_student_perf: string;
  teacher_modal_report_close: string;
  teacher_modal_report_export: string;

  teacher_modal_group_title_prefix: string;
  teacher_modal_group_title_suffix: string;
  teacher_modal_group_desc: string;
  teacher_modal_group_info: string;
  teacher_modal_group_students: string;
  teacher_modal_group_subject: string;
  teacher_modal_group_level: string;
  teacher_modal_group_year: string;
  teacher_modal_group_active_students: string;
  teacher_modal_group_inactive_students: string;
  teacher_modal_group_room: string;
  teacher_modal_group_stats: string;
  teacher_modal_group_grade_dist: string;
  teacher_modal_group_attendance_overview: string;
  teacher_modal_group_student_list: string;
  teacher_modal_group_student_list_desc: string;
  teacher_modal_group_status_active: string;
  teacher_modal_group_quick_actions: string;
  teacher_modal_group_enter_grades: string;
  teacher_modal_group_mark_attendance: string;
  teacher_modal_group_view_report: string;
  teacher_modal_group_close: string;
  teacher_modal_group_export: string;
  experience: string;
  qualification: string;
  teacher_modal_attendance: string;
  teacher_modal_group_name: string;
  teacher_modal_group_distribution_excellent1: string;
  teacher_modal_group_distribution_good1: string;
  teacher_modal_group_distribution_average1: string;
  teacher_modal_group_distribution_needs1: string;
  Current_Grade: string;



  teacher_meetings_request_title: string;

  teacher_meetings_select_parent: string;
  teacher_meetings_search_placeholder: string;
  teacher_meetings_choose_parent: string;

  teacher_meetings_cause_label: string;
  teacher_meetings_select_cause: string;
  teacher_meetings_cause_academic: string;
  teacher_meetings_cause_behavioral: string;
  teacher_meetings_cause_attendance: string;
  teacher_meetings_cause_health: string;
  teacher_meetings_cause_admin: string;
  teacher_meetings_cause_extra: string;
  teacher_meetings_cause_followup: string;
  teacher_meetings_cause_conflict: string;

  teacher_meetings_date_label: string;
  teacher_meetings_notes_label: string;
  teacher_meetings_notes_placeholder: string;
  teacher_meetings_send_request: string;

  teacher_meetings_list_title: string;
  teacher_meetings_section_action_required: string;
  teacher_meetings_section_upcoming: string;
  teacher_meetings_section_pending: string;
  teacher_meetings_section_archived: string;

  teacher_meetings_with: string;
  teacher_meetings_by: string;
  teacher_meetings_cause_display: string;
  teacher_meetings_meeting_on: string;
  teacher_meetings_scheduled: string;
  teacher_meetings_notes: string;
  teacher_meetings_children: string;

  teacher_meetings_btn_accept: string;
  teacher_meetings_btn_decline: string;
  teacher_meetings_btn_reschedule: string;
  teacher_meetings_btn_confirm_date: string;
  teacher_meetings_btn_decline_date: string;

  teacher_meetings_empty: string;
  teacher_meetings_group: string;





  student_dialog_add_title: string;
  student_dialog_edit_title: string;
  student_dialog_add_desc: string;
  student_dialog_edit_desc_prefix: string;
  student_dialog_edit_desc_suffix: string;

  student_dialog_section_account: string;
  student_dialog_section_personal: string;

  student_dialog_username: string;
  student_dialog_full_name: string;
  student_dialog_phone: string;
  student_dialog_email: string;
  student_dialog_password: string;

  student_dialog_password_placeholder_new: string;
  student_dialog_password_placeholder_edit: string;
  student_dialog_show_password: string;
  student_dialog_hide_password: string;

  student_dialog_nationality: string;
  student_dialog_birth_city: string;
  student_dialog_birth_date: string;
  student_dialog_sex: string;
  student_dialog_select_country: string;
  student_dialog_select_city: string;
  student_dialog_select_sex: string;
  student_dialog_male: string;
  student_dialog_female: string;

  student_dialog_error: string;

  student_dialog_cancel: string;
  student_dialog_saving: string;
  student_dialog_update: string;
  student_dialog_add: string;
  student_dialog_group_history: string;



  emp_finance_title: string;
  emp_finance_subtitle: string;

  emp_finance_total_employees: string;
  emp_finance_finance_complete: string;
  emp_finance_pending_payroll: string;
  emp_finance_estimated_payroll: string;

  emp_finance_search_placeholder: string;
  emp_finance_filter_department: string;
  emp_finance_filter_status: string;
  emp_finance_filter_all_departments: string;
  emp_finance_filter_all_statuses: string;
  emp_finance_filter_done: string;
  emp_finance_filter_pending: string;
  emp_finance_filter_undone: string;

  emp_finance_add_staff_btn: string;

  emp_finance_no_employee_title: string;
  emp_finance_no_employee_subtitle: string;

  emp_finance_dialog_add_title: string;
  emp_finance_dialog_edit_title: string;
  emp_finance_dialog_add_desc: string;
  emp_finance_dialog_edit_desc: string;

  emp_finance_form_name: string;
  emp_finance_form_position: string;
  emp_finance_form_department: string;
  emp_finance_form_hire_date: string;
  emp_finance_form_salary: string;
  emp_finance_form_bank_account: string;
  emp_finance_form_status: string;
  emp_finance_form_select_status: string;
  emp_finance_form_status_active: string;
  emp_finance_form_status_inactive: string;

  emp_finance_btn_cancel: string;
  emp_finance_btn_save: string;
  emp_finance_btn_create: string;

  emp_finance_attendance_title: string;
  emp_finance_attendance_desc_prefix: string;
  emp_finance_attendance_desc_suffix: string;
  emp_finance_attendance_col_date: string;
  emp_finance_attendance_col_status: string;
  emp_finance_attendance_col_time: string;
  emp_finance_no_attendance: string;

  emp_finance_transaction_title: string;
  emp_finance_transaction_desc_prefix: string;
  emp_finance_transaction_desc_suffix: string;
  emp_finance_transaction_col_date: string;
  emp_finance_transaction_col_desc: string;
  emp_finance_transaction_col_type: string;
  emp_finance_transaction_col_amount: string;
  emp_finance_no_transactions: string;

  emp_finance_payroll_title: string;
  emp_finance_payroll_desc_prefix: string;
  emp_finance_payroll_desc_suffix: string;
  emp_finance_payroll_base_salary: string;
  emp_finance_payroll_tax_percent: string;
  emp_finance_payroll_absence_penalty: string;
  emp_finance_payroll_late_penalty: string;
  emp_finance_payroll_final_salary: string;
  emp_finance_payroll_confirm_btn: string;

  emp_finance_profile_monthly_salary: string;
  emp_finance_profile_last_payment: string;
  emp_finance_profile_absence_report: string;
  emp_finance_profile_not_set: string;
  emp_finance_profile_na: string;

  emp_finance_profile_btn_view: string;
  emp_finance_profile_btn_edit: string;
  emp_finance_profile_btn_delete: string;
  emp_finance_profile_btn_pay_salary: string;

  emp_finance_status_complete: string;
  emp_finance_status_pending: string;
  emp_finance_status_no_salary: string;

  emp_finance_attendance_present: string;
  emp_finance_attendance_absent: string;
  emp_finance_attendance_late: string;
  emp_finance_attendance_justified: string;
  emp_finance_attendance_holiday: string;
  emp_finance_attendance_rest: string;
  emp_finance_attendance_unknown: string;





  fin_dash_title: string;
  fin_dash_subtitle: string;

  fin_dash_period_label: string;
  fin_dash_period_overall: string;
  fin_dash_period_select: string;

  fin_dash_stat_net_profit: string;
  fin_dash_stat_total_income: string;
  fin_dash_stat_total_expenses: string;
  fin_dash_stat_profiles: string;
  fin_dash_profiles_students: string;
  fin_dash_profiles_teachers: string;
  fin_dash_profiles_staff: string;

  fin_dash_breakdown_title: string;
  fin_dash_breakdown_desc: string;
  fin_dash_breakdown_income: string;
  fin_dash_breakdown_expense: string;
  fin_dash_breakdown_no_income: string;
  fin_dash_breakdown_no_expense: string;

  fin_dash_monthly_title: string;
  fin_dash_monthly_desc: string;

  fin_dash_transactions_title: string;
  fin_dash_transactions_desc: string;
  fin_dash_transactions_search_placeholder: string;
  fin_dash_transactions_type_placeholder: string;
  fin_dash_transactions_filter_all: string;
  fin_dash_transactions_filter_income: string;
  fin_dash_transactions_filter_expense: string;
  fin_dash_transactions_col_details: string;
  fin_dash_transactions_col_amount: string;
  fin_dash_no_transactions_title: string;
  fin_dash_no_transactions_subtitle: string;

  fin_dash_no_data_title: string;
  fin_dash_no_data_desc: string;
  fin_dash_loading_msg: string;





  fin_set_title: string;
  fin_set_subtitle: string;
  fin_set_save_btn: string;
  fin_set_save_alert: string;

  fin_set_general_title: string;
  fin_set_general_desc: string;
  fin_set_currency_label: string;
  fin_set_tax_label: string;
  fin_set_payroll_label: string;
  fin_set_fiscal_label: string;

  fin_set_student_title: string;
  fin_set_student_desc: string;
  fin_set_auto_reminder_label: string;
  fin_set_auto_reminder_desc: string;
  fin_set_late_fee_label: string;
  fin_set_late_fee_hint: string;
  fin_set_grace_label: string;
  fin_set_grace_hint: string;

  fin_set_system_title: string;
  fin_set_system_desc: string;
  fin_set_system_storage_label: string;
  fin_set_system_storage_val: string;
  fin_set_system_updated_label: string;

  fin_set_currency_list_usd: string;
  fin_set_currency_list_eur: string;
  fin_set_currency_list_gbp: string;
  fin_set_currency_list_cad: string;
  fin_set_currency_list_aud: string;
  fin_set_currency_list_jpy: string;
  fin_set_currency_list_cny: string;
  fin_set_currency_list_inr: string;

  fin_set_payroll_weekly: string;
  fin_set_payroll_biweekly: string;
  fin_set_payroll_monthly: string;
  fin_set_payroll_quarterly: string;

  fin_set_fiscal_jan: string;
  fin_set_fiscal_feb: string;
  fin_set_fiscal_mar: string;
  fin_set_fiscal_apr: string;
  fin_set_fiscal_may: string;
  fin_set_fiscal_jun: string;
  fin_set_fiscal_jul: string;
  fin_set_fiscal_aug: string;
  fin_set_fiscal_sep: string;
  fin_set_fiscal_oct: string;
  fin_set_fiscal_nov: string;
  fin_set_fiscal_dec: string;




  inc_out_total_income: string;
  inc_out_total_expenses: string;
  inc_out_net_flow: string;
  inc_out_search_placeholder: string;
  inc_out_from_label: string;
  inc_out_to_label: string;
  inc_out_add_btn: string;
  inc_out_record_title: string;
  inc_out_select_type_placeholder: string;
  inc_out_type_income: string;
  inc_out_type_expense: string;
  inc_out_amount_placeholder: string;
  inc_out_description_placeholder: string;
  inc_out_save_btn: string;
  inc_out_no_payment_method: string;
  inc_out_transaction_student_fees: string;
  inc_out_transaction_salary: string;

  emp_finance_missing_profiles: string;
  emp_finance_missing_profiles_desc: string;
  emp_finance_missing_profiles_desc_suffix: string;
  emp_finance_create_all: string;
  emp_finance_all_profiles_created: string;
  emp_finance_all_profiles_created_desc: string;




  staffdb_title: string;
  staffdb_description: string;
  staffdb_add_btn: string;
  staffdb_add_new_title: string;
  staffdb_edit_title: string;
  staffdb_add_description: string;
  staffdb_edit_description: string;
  staffdb_label_fullname: string;
  staffdb_label_position: string;
  staffdb_label_department: string;
  staffdb_label_phone: string;
  staffdb_label_email: string;
  staffdb_label_address: string;
  staffdb_label_emergency: string;
  staffdb_label_notes: string;
  staffdb_placeholder_address: string;
  staffdb_placeholder_emergency: string;
  staffdb_placeholder_notes: string;
  staffdb_btn_add_member: string;
  staffdb_btn_update_member: string;
  staffdb_btn_cancel: string;
  staffdb_search_placeholder: string;
  staffdb_btn_view: string;
  staffdb_btn_edit: string;
  staffdb_btn_delete: string;
  staffdb_delete_confirm: string;
  staffdb_no_staff_title: string;
  staffdb_no_staff_add_text: string;
  staffdb_no_staff_search_text: string;
  staffdb_add_first_btn: string;
  staffdb_total_staff: string;
  staffdb_total_staff_desc: string;
  staffdb_departments: string;
  staffdb_departments_desc: string;
  staffdb_recent_additions: string;
  staffdb_recent_additions_desc: string;
  staffdb_view_title: string;
  staffdb_view_description_prefix: string;
  staffdb_section_basic: string;
  staffdb_section_contact: string;
  staffdb_section_additional: string;
  staffdb_field_fullname: string;
  staffdb_field_position: string;
  staffdb_field_department: string;
  staffdb_field_added_date: string;
  staffdb_field_phone: string;
  staffdb_field_email: string;
  staffdb_field_address: string;
  staffdb_field_emergency: string;
  staffdb_field_notes: string;
  staffdb_btn_close: string;
  staffdb_added_label: string;
  staffdb_emergency_label_prefix: string;





  stdpay_title: string;
  stdpay_description: string;
  stdpay_card_students: string;
  stdpay_card_transactions: string;
  stdpay_card_revenue: string;
  stdpay_card_average: string;
  stdpay_filter_placeholder: string;
  stdpay_filter_all: string;
  stdpay_filter_due: string;
  stdpay_filter_never: string;
  stdpay_filter_monthly: string;
  stdpay_filter_quarterly: string;
  stdpay_filter_yearly: string;
  stdpay_search_placeholder: string;
  stdpay_status_paid: string;
  stdpay_status_due: string;
  stdpay_status_overdue: string;
  stdpay_status_never: string;
  stdpay_plan_label: string;
  stdpay_last_payment: string;
  stdpay_next_due: string;
  stdpay_btn_record_payment: string;
  stdpay_btn_view_details: string;
  stdpay_no_students_title: string;
  stdpay_no_students_text: string;
  stdpay_dialog_record_title: string;
  stdpay_dialog_record_for_prefix: string;
  stdpay_label_amount: string;
  stdpay_label_description: string;
  stdpay_label_plan: string;
  stdpay_label_method: string;
  stdpay_placeholder_amount: string;
  stdpay_option_monthly: string;
  stdpay_option_quarterly: string;
  stdpay_option_yearly: string;
  stdpay_option_cash: string;
  stdpay_option_card: string;
  stdpay_option_bank: string;
  stdpay_btn_save: string;
  stdpay_btn_saving: string;
  stdpay_error_submit: string;
  stdpay_dialog_history_title: string;
  stdpay_dialog_history_prefix: string;
  stdpay_table_date: string;
  stdpay_table_desc: string;
  stdpay_table_plan: string;
  stdpay_table_method: string;
  stdpay_table_amount: string;
  stdpay_table_no_data: string;
  stdpay_total_paid: string;





  school_settings_loading: string;
  school_settings_loading_text: string;
  school_settings_title: string;
  school_settings_description: string;
  school_settings_general_info: string;
  school_settings_school_name: string;
  school_settings_school_type: string;
  school_settings_derivation_key: string;
  school_settings_location_coords: string;
  school_settings_latitude: string;
  school_settings_longitude: string;
  school_settings_drag_pin: string;
  school_settings_location_map: string;
  school_settings_error_auth: string;
  school_settings_error_unknown: string;
  school_settings_error_save: string;
  school_settings_success_update: string;
  school_settings_save_changes: string;





  signup_title: string;
  signup_subtitle: string;
  signup_selected_plan: string;
  signup_selected_plan_placeholder: string;
  signup_plan_includes: string;
  signup_plan_see_included: string;
  signup_school_info_title: string;
  signup_school_info_desc: string;
  signup_fullname_label: string;
  signup_fullname_placeholder: string;
  signup_schoolname_label: string;
  signup_schoolname_placeholder: string;
  signup_email_label: string;
  signup_email_placeholder: string;
  signup_phone_label: string;
  signup_phone_placeholder: string;
  signup_phone_desc: string;
  signup_submit: string;
  signup_submitting: string;
  signup_success_title: string;
  signup_success_desc: string;
  signup_submit_another: string;
  signup_plan_starter_name: string;
  signup_plan_starter_price: string;
  signup_plan_starter_desc: string;
  signup_plan_prof_name: string;
  signup_plan_prof_price: string;
  signup_plan_prof_desc: string;
  signup_plan_enterprise_name: string;
  signup_plan_enterprise_price: string;
  signup_plan_enterprise_desc: string;
  signup_plan_feature_1: string;
  signup_plan_feature_2: string;
  signup_plan_feature_3: string;
  signup_plan_feature_4: string;
  signup_plan_feature_5: string;
  signup_plan_feature_6: string;
  signup_plan_popular: string;
  signup_logo_alt: string;
  signup_title_suffix: string;
  signup_title_suffix_2: string;
  signup_plan_more_features: string;








    // Titles
    gm_title: string;
    gm_subtitle_prefix: string;
    gm_subtitle_suffix: string;
  
    // Buttons
    gm_btn_reload: string;
    gm_btn_create_group: string;
    gm_btn_apply_season: string;
    gm_btn_clear: string;
    gm_btn_cancel: string;
    gm_btn_create: string;
    gm_btn_view: string;
    gm_btn_delete: string;
    gm_btn_close: string;
  
    // Alerts / Empty states
    gm_alert_no_school_type_title: string;
    gm_alert_no_school_type_desc: string;
    gm_no_groups_title: string;
    gm_no_groups_desc_start: string;
    gm_no_groups_desc_filter: string;
    gm_no_groups_btn: string;
  
    // Filters
    gm_filter_title: string;
    gm_search_placeholder: string;
    gm_filter_grade_placeholder: string;
    gm_filter_status_placeholder: string;
    gm_filter_all_levels: string;
    gm_filter_all_specialities: string;
    gm_filter_start_year_placeholder: string;
    gm_filter_end_year_placeholder: string;
    gm_filter_invalid_range: string;
    gm_filter_currently_showing: string;
  
    // Create Dialog
    gm_create_title: string;
    gm_create_desc_prefix: string;
    gm_create_desc_suffix: string;
    gm_loading: string;
    gm_academic_info: string;
    gm_required_notice: string;
    gm_school_level: string;
    gm_configured_by: string;
    gm_speciality_label: string;
    gm_select_speciality_placeholder: string;
    gm_level_label: string;
    gm_select_level_placeholder: string;
    gm_select_speciality_first: string;
    gm_room_season_details: string;
    gm_season_label: string;
    gm_select_season_placeholder: string;
    gm_subject_assignment: string;
    gm_subject_details_format: string;
    gm_coef_label: string;
    gm_obligatory: string;
    gm_optional: string;
    gm_no_subjects_message: string;
    gm_error_general: string;
  
    // View Dialog
    gm_view_title: string;
    gm_view_desc_prefix: string;
    gm_basic_info: string;
    gm_label_group_name: string;
    gm_label_school_type: string;
    gm_label_speciality: string;
    gm_label_created_date: string;
    gm_modules_teachers: string;
    gm_teacher_assigned: string;
    gm_no_teacher: string;
  
    // Delete Dialog
    gm_delete_title: string;
    gm_delete_warning: string;
    gm_delete_list1: string;
    gm_delete_list2: string;
    gm_delete_list3: string;
    gm_delete_irreversible: string;
    gm_delete_cancel: string;
    gm_delete_confirm: string;
    gm_deleting: string;
    gm_label_room: string;
    gm_label_teachers: string;
    gm_label_created: string;
    gm_required_notice_suffix: string;
    gm_delete_irreversible_desc: string;






      // General
  mm_title_loading: string;
  mm_title_error: string;
  mm_error_description: string;
  mm_retry_btn: string;
  mm_no_meetings: string;

  // Toast messages
  mm_toast_error_load_title: string;
  mm_toast_error_load_desc: string;
  mm_toast_success_action: string;
  mm_toast_error_action: string;

  // Confirmation
  mm_confirm_delete: string;

  // Sections
  mm_section_action_required: string;
  mm_section_upcoming: string;
  mm_section_reschedule: string;
  mm_section_archived: string;

  // Card labels
  mm_meeting_with: string;
  mm_requested_on: string;
  mm_scheduled: string;
  mm_notes: string;

  // Buttons
  mm_btn_approve: string;
  mm_btn_decline: string;
  mm_btn_confirm_reschedule: string;
  mm_btn_delete: string;

  // Status colors meaning
  mm_status_accepted: string;
  mm_status_declined: string;
  mm_status_inprogress: string;
  mm_status_pending: string;







    // Tabs
    pm_tab_link_parent: string;
    pm_tab_create_parent: string;
  
    // Link parent tab
    pm_link_title: string;
    pm_link_description: string;
    pm_select_student_label: string;
    pm_select_student_placeholder: string;
    pm_select_parent_label: string;
    pm_select_parent_placeholder: string;
    pm_relationship_label: string;
    pm_relationship_placeholder: string;
    pm_relationship_father: string;
    pm_relationship_mother: string;
    pm_error_select_both: string;
    pm_error_auth_failed: string;
    pm_success_linked: string;
    pm_link_btn: string;
    pm_link_loading: string;
  
    // Create parent tab
    pm_create_title: string;
    pm_create_description: string;
    pm_label_full_name: string;
    pm_label_email: string;
    pm_label_phone: string;
    pm_label_nid: string;
    pm_label_username: string;
    pm_label_password: string;
    pm_label_declared_relationship: string;
    pm_success_create: string;
    pm_error_create: string;
    pm_btn_create: string;
    pm_btn_loading: string;
  
    // Alerts
    pm_alert_error_title: string;
    pm_alert_success_title: string;







    po_loading_text: string;

    // Page header
    po_title: string;
    po_description: string;
    po_back_btn: string;
  
    // Stat cards
    po_total_students: string;
    po_total_teachers: string;
    po_active_groups: string;
    po_unassigned_students: string;
    po_students_change: string;
    po_teachers_change: string;
    po_groups_change_prefix: string;
    po_unassigned_change: string;
  
    // Enrollment card
    po_enrollment_title: string;
    po_enrollment_description: string;
    po_registered_label: string;
    po_unassigned_label: string;
  
    // Level distribution
    po_level_title: string;
    po_level_description: string;
    po_no_students_group: string;
  
    // Top teachers
    po_top_teachers_title: string;
    po_top_teachers_description: string;
    po_no_teachers_group: string;
    po_groups_label: string;
  
    // Recent activities
    po_recent_title: string;
    po_recent_description: string;
    po_no_activities: string;
    po_activity_new_student: string;
    po_activity_new_teacher: string;
    po_activity_new_group: string;
  
    // Quick actions
    po_quick_title: string;
    po_quick_description: string;
    po_action_add_student_title: string;
    po_action_add_student_desc: string;
    po_action_add_teacher_title: string;
    po_action_add_teacher_desc: string;
    po_action_create_group_title: string;
    po_action_create_group_desc: string;
    po_action_assign_students_title: string;
    po_action_assign_students_desc: string;











    ps_title: string;
    ps_description: string;
  
    // Tabs
    ps_tab_general: string;
    ps_tab_grading: string;
    ps_tab_subjects: string;
    ps_tab_groups: string;
  
    // General Section
    ps_school_schedule_title: string;
    ps_school_schedule_desc: string;
    ps_start_time_label: string;
    ps_end_time_label: string;
    ps_class_duration_label: string;
    ps_break_duration_label: string;
    ps_max_students_label: string;
    ps_save_general_btn: string;
  
    ps_feature_title: string;
    ps_feature_desc: string;
    ps_parent_notif_label: string;
    ps_parent_notif_desc: string;
    ps_attendance_label: string;
    ps_attendance_desc: string;
    ps_grade_reports_label: string;
    ps_grade_reports_desc: string;
  
    // Grading Section
    ps_grading_title: string;
    ps_grading_desc: string;
    ps_system_label: string;
    ps_system_placeholder: string;
    ps_system_20point: string;
    ps_system_letter: string;
    ps_system_percentage: string;
    ps_system_passfail: string;
    ps_passing_label: string;
    ps_passing_placeholder: string;
    ps_report_frequency_label: string;
    ps_report_frequency_placeholder: string;
    ps_report_frequency_monthly: string;
    ps_report_frequency_quarterly: string;
    ps_report_frequency_semester: string;
    ps_report_frequency_annual: string;
    ps_midterm_label: string;
    ps_midterm_desc: string;
    ps_final_label: string;
    ps_final_desc: string;
    ps_save_grading_btn: string;
  
    // Subjects Section
    ps_subjects_title: string;
    ps_subjects_desc: string;
    ps_core_label: string;
    ps_add_core_btn: string;
    ps_elective_label: string;
    ps_add_elective_btn: string;
    ps_weighting_label: string;
    ps_weighting_desc: string;
    ps_default_weight_label: string;
    ps_available_subjects_label: string;
    ps_save_subjects_btn: string;
  
    // Groups Section
    ps_groups_title: string;
    ps_groups_desc: string;
    ps_auto_create_label: string;
    ps_auto_create_desc: string;
    ps_group_pattern_label: string;
    ps_group_pattern_placeholder: string;
    ps_group_pattern_hint_prefix: string;
    ps_group_pattern_hint_suffix: string;
    ps_mixed_label: string;
    ps_mixed_desc: string;
    ps_max_groups_label: string;
    ps_save_groups_btn: string;
  
    // Alert
    ps_alert_status_prefix: string;
    ps_alert_status_suffix: string;
    ps_group_pattern_hint_prefix1: string;





    sm_title: string;
    sm_description_prefix: string;
    sm_description_suffix: string;
    sm_select_group_placeholder: string;
  
    sm_group_schedule_title_prefix: string;
    sm_group_schedule_title_suffix: string;
    sm_level_label: string;
    sm_specialty_label: string;
  
    sm_clear_btn: string;
    sm_save_btn: string;
    sm_preview_btn: string;
    sm_export_btn: string;
    sm_add_class_btn: string;
  
    sm_clear_dialog_title: string;
    sm_clear_dialog_description: string;
    sm_clear_dialog_cancel: string;
    sm_clear_dialog_confirm: string;
  
    sm_loading_message: string;
  
    sm_edit_class_title: string;
    sm_add_class_title: string;
    sm_dialog_desc: string;
  
    sm_day_label: string;
    sm_day_placeholder: string;
    sm_subject_label: string;
    sm_subject_placeholder: string;
    sm_start_label: string;
    sm_start_placeholder: string;
    sm_end_label: string;
    sm_end_placeholder: string;
    sm_teacher_label: string;
    sm_teacher_placeholder: string;
    sm_teacher_placeholder_no_subject: string;
    sm_room_label: string;
    sm_room_placeholder: string;
  
    sm_conflict_title: string;
    sm_conflict_desc_group: string;
    sm_conflict_desc_teacher: string;
    sm_conflict_desc_room: string;
  
    sm_cancel_btn: string;
    sm_update_btn: string;
    sm_add_btn: string;
  
    sm_preview_title_prefix: string;
    sm_preview_desc: string;
    sm_preview_close_btn: string;
  
    sm_pdf_title: string;
    sm_pdf_group: string;
    sm_pdf_specialty: string;
    sm_pdf_level: string;
    sm_pdf_season: string;
    sm_pdf_teachers_head: string;
    sm_pdf_subjects_head: string;
    sm_pdf_day_head: string;
    sm_pdf_time_head: string;
    sm_clear_dialog_description1: string;
    sm_delete_btn: string;







    sga_select_group_title: string;
    sga_select_group_desc: string;
    sga_select_group_placeholder: string;
  
    sga_loading_message: string;
    sga_error_title: string;
  
    sga_assigned_members_title: string;
    sga_pending_assignments_title: string;
    sga_current_members_title: string;
    sga_no_students_msg: string;
  
    sga_available_students_title: string;
    sga_filter_unassigned: string;
    sga_filter_registered: string;
    sga_filter_group_placeholder: string;
    sga_filter_all_compatible: string;
    sga_search_placeholder: string;
    sga_in_label: string;
    sga_transfer_btn: string;
    sga_assign_btn: string;
    sga_save_assignments_btn: string;
  
    sga_empty_state_title: string;
    sga_empty_state_desc: string;
  
    sga_transfer_confirm_title: string;
    sga_transfer_confirm_specialty_title: string;
    sga_transfer_confirm_warning_title: string;
    sga_transfer_confirm_warning_desc: string;
    sga_transfer_confirm_desc_prefix: string;
    sga_transfer_confirm_desc_suffix: string;
    sga_transfer_failed_title: string;
    sga_transfer_cancel_btn: string;
    sga_transfer_confirm_btn: string;
  
    sga_unassign_confirm_title: string;
    sga_unassign_warning_title: string;
    sga_unassign_warning_desc: string;
    sga_unassign_confirm_desc_prefix: string;
    sga_unassign_confirm_desc_suffix: string;
    sga_unassign_failed_title: string;
    sga_unassign_cancel_btn: string;
    sga_unassign_confirm_btn: string;
  
    sga_save_confirm_title: string;
    sga_save_confirm_desc: string;
    sga_save_new_assignments_title: string;
    sga_save_loading_msg: string;
    sga_save_success_msg: string;
    sga_save_failed_title: string;
    sga_save_cancel_btn: string;
    sga_save_confirm_btn: string;
    sga_save_retry_btn: string;
    sga_save_close_btn: string;
    sga_transfer_confirm_desc_suffix2: string;
    sga_transfer_confirm_desc_suffix1: string;
    sga_transfer_confirm_desc_prefix1: string;








    sm_title1: string;
    sm_desc: string;
    sm_reload_btn: string;
    sm_add_btn1: string;
  
    sm_search_filter_title: string;
    sm_search_placeholder: string;
    sm_filter_placeholder: string;
    sm_filter_all: string;
    sm_filter_registered: string;
    sm_filter_not_registered: string;
  
    sm_students_title: string;
    sm_students_desc: string;
    sm_no_students_title: string;
    sm_no_students_desc_has_students: string;
    sm_no_students_desc_empty: string;
  
    sm_add_dialog_title: string;
    sm_edit_dialog_title: string;
    sm_dialog_desc1: string;
    sm_account_info_title: string;
    sm_personal_info_title: string;
    sm_username: string;
    sm_full_name: string;
    sm_phone_number: string;
    sm_email: string;
    sm_password: string;
    sm_password_placeholder_new: string;
    sm_password_placeholder_edit: string;
    sm_nationality: string;
    sm_sex: string;
    sm_birth_date: string;
    sm_birth_city: string;
    sm_select_country: string;
    sm_select_city: string;
    sm_select_sex: string;
    sm_male: string;
    sm_female: string;
    sm_cancel_btn1: string;
    sm_add_student_btn: string;
    sm_update_student_btn: string;
  
    sm_view_account_info: string;
    sm_view_personal_info: string;
    sm_view_group_history: string;
    sm_registered_label: string;
    sm_not_registered_label: string;
    sm_speciality_label: string;
    sm_close_btn: string;
  
    sm_registered_status: string;
    sm_not_registered_status: string;
    sm_registered_with_group: string;
  
    sm_error_auth_expired: string;
    sm_error_unexpected: string;
    sm_born_prefix: string;
    sm_view_btn: string;
    sm_edit_btn: string;
    sm_mother_phone_number: string;
    sm_father_phone_number: string;
    sm_years_old: string;








      tm_title: string;
      tm_desc: string;
      tm_reload_btn: string;
      tm_add_btn: string;
    
      tm_school_not_configured_alert_title: string;
      tm_school_not_configured_alert_desc_1: string;
      tm_school_not_configured_alert_desc_2: string;
      tm_school_not_configured_card_title: string;
      tm_school_not_configured_card_desc: string;
    
      tm_loading_text: string;
    
      tm_school_type_label: string;
      tm_subjects_available_label: string;
    
      tm_search_filter_title: string;
      tm_search_placeholder: string;
      tm_filter_placeholder: string;
      tm_filter_all: string;
      tm_filter_active: string;
      tm_filter_inactive: string;
      tm_filter_on_leave: string;
    
      tm_teachers_title: string;
      tm_teachers_desc: string;
      tm_no_teachers_title: string;
      tm_no_teachers_desc_empty: string;
      tm_no_teachers_desc_has_teachers: string;
    
      tm_card_id: string;
      tm_card_joined: string;
      tm_card_modules_label: string;
      tm_card_more_label: string;
      tm_card_view_btn: string;
      tm_card_edit_btn: string;
      tm_card_delete_btn: string;
    
      tm_dialog_add_title: string;
      tm_dialog_edit_title: string;
      tm_dialog_add_desc: string;
      tm_dialog_edit_desc_1: string;
      tm_dialog_edit_desc_2: string;
    
      tm_form_basic_info: string;
      tm_username: string;
      tm_full_name: string;
      tm_phone_number: string;
      tm_national_id: string;
      tm_email: string;
      tm_password: string;
      tm_password_placeholder_new: string;
      tm_password_placeholder_edit: string;
    
      tm_subjects_selected_label: string;
      tm_subjects_list_label: string;
      tm_cancel_btn: string;
      tm_add_teacher_btn: string;
      tm_update_teacher_btn: string;
    
      tm_view_title: string;
      tm_view_desc_part1: string;
      tm_view_desc_part2: string;
      tm_view_assigned_subjects: string;
      tm_view_basic_info: string;
      tm_view_teaching_history: string;
      tm_view_history_assigned: string;
      tm_view_history_removed: string;
      tm_view_history_no_data: string;
      tm_close_btn: string;
    
      tm_error_no_token: string;
      tm_error_submit_fail: string;
      tm_desc_prefix: string;
      tm_desc_suffix: string;
      tm_card_more_label1: string;
      tm_of_total: string;
      tm_created_date: string;








      lp_nav_about: string;
      lp_nav_features: string;
      lp_nav_dev_team: string;
      lp_nav_pricing: string;
      lp_dashboard_btn: string;
    
      lp_about_badge: string;
      lp_about_title_part1: string;
      lp_about_title_highlight: string;
      lp_about_title_part2: string;
      lp_about_desc: string;
      lp_about_get_started: string;
      lp_about_watch_demo: string;
    
      lp_features_title: string;
      lp_features_desc: string;
    
      lp_feature_headmaster_title: string;
      lp_feature_headmaster_desc: string;
      lp_feature_teacher_title: string;
      lp_feature_teacher_desc: string;
      lp_feature_student_title: string;
      lp_feature_student_desc: string;
      lp_feature_parent_title: string;
      lp_feature_parent_desc: string;
      lp_feature_admin_title: string;
      lp_feature_admin_desc: string;
      lp_feature_analytics_title: string;
      lp_feature_analytics_desc: string;
    
      lp_team_title: string;
      lp_team_desc_prefix: string;
      lp_team_member_1_name: string;
      lp_team_member_1_role: string;
      lp_team_member_1_bio: string;
      lp_team_member_2_name: string;
      lp_team_member_2_role: string;
      lp_team_member_2_bio: string;
    
      lp_pricing_title: string;
      lp_pricing_desc: string;
      lp_pricing_plan_starter: string;
      lp_pricing_plan_professional: string;
      lp_pricing_plan_enterprise: string;
      lp_pricing_plan_period: string;
      lp_pricing_plan_popular: string;
      lp_pricing_plan_get_started: string;
      lp_pricing_footer_btn: string;
    
      lp_footer_text_part1: string;
      lp_footer_text_heart: string;
      lp_footer_text_part2: string;





      editAdminDesc2: string;
      adminManagementTitle1: string;
  adminManagementDesc1: string;

  addAdmin1 : string;

  successTitle1: string;

  adminStaffMembers1: string;
  adminStaffMembersDesc1: string;

  actions1: string;
  loadingAdminData1: string;
  noAdminsFound1: string;

  createNewAdmin1: string;
  editAdmin1: string;

  createNewAdminDesc1: string;
  editAdminDesc1: string;

  leaveBlank1: string;

  createAdmin1: string;
  saveChanges1: string;

  phoneNumber1: string;

  authenticationFailed1: string;
  passwordTooShort1: string;
  passwordTooShortEdit1: string;

  adminCreatedSuccess1: string;
  adminUpdatedSuccess1: string;

  unknownError1: string;



 // Page title & intro
 tabPwdMgmt_title1: string
 tabPwdMgmt_description: string

 // Loading state
 tabPwdMgmt_loading: string

 // Password status card
 tabPwdMgmt_statusTitle: string
 tabPwdMgmt_statusSuffix: string
 tabPwdMgmt_configuredLabel: string

 // Tabs names
 tabPwdMgmt_tabPedagogy: string
 tabPwdMgmt_tabFinance: string
 tabPwdMgmt_tabAttendance: string
 tabPwdMgmt_tabAssets: string

 // Tabs descriptions
 tabPwdMgmt_descPedagogy: string
 tabPwdMgmt_descFinance: string
 tabPwdMgmt_descAttendance: string
 tabPwdMgmt_descAssets: string

 // State badges
 tabPwdMgmt_stateSet: string
 tabPwdMgmt_stateNotSet: string

 // Buttons
 tabPwdMgmt_btnSetPassword: string
 tabPwdMgmt_btnUpdatePassword: string
 tabPwdMgmt_btnCancel: string
 tabPwdMgmt_btnSave: string

 // Dialog
 tabPwdMgmt_dialogSetTitle: string
 tabPwdMgmt_dialogUpdateTitle: string
 tabPwdMgmt_dialogCreateDesc: string
 tabPwdMgmt_dialogUpdateDesc: string

 // Inputs
 tabPwdMgmt_labelNewPassword: string
 tabPwdMgmt_labelConfirmPassword: string
 tabPwdMgmt_placeholderPassword: string
 tabPwdMgmt_placeholderConfirmPassword: string

 // Errors
 tabPwdMgmt_errorEmpty: string
 tabPwdMgmt_errorTooShort: string
 tabPwdMgmt_errorMismatch: string
 tabPwdMgmt_errorFetchStatus: string

 // Success
 tabPwdMgmt_successUpdate: string

 // Notice
 tabPwdMgmt_importantLabel: string
 tabPwdMgmt_importantNotice: string




 // Button & dialog
 assetAdd_btnAddAsset: string
 assetAdd_btnAdd: string
 assetAdd_btnAddPlural: string

 // Placeholders
 assetAdd_phName: string
 assetAdd_phSerial: string
 assetAdd_phPurchasePrice: string
 assetAdd_phDescription: string
 assetAdd_phSelectCategory: string
 assetAdd_phSelectLocation: string

 // Toasts
 assetAdd_toastSuccessPrefix: string
 assetAdd_toastSuccessSingular: string
 assetAdd_toastSuccessPlural: string
 assetAdd_toastErrorFallback: string
 assetAdd_errorAuth: string

 // Quantity info alert
 assetAdd_multiExamplePrefix: string
 assetAdd_multiExampleSuffix: string

 // Total cost
 assetAdd_totalCostSuffix: string

 // Categories
 assetCatFurniture: string
 assetCatIT: string
 assetCatLab: string
 assetCatSport: string
 assetCatAV: string
 assetCatMusic: string
 assetCatBooks: string
 assetCatCanteen: string
 assetCatMaintenance: string
 assetCatVehicles: string
 assetCatSecurity: string
 assetCatOther: string

 // Locations
 assetLocMainOffice: string
 assetLocTeachersRoom: string
 assetLocComputerRoom: string
 assetLocLibrary: string
 assetLocGym: string
 assetLocScienceLab: string
 assetLocArtRoom: string
 assetLocMusicRoom: string
 assetLocCanteen: string
 assetLocStorage: string
 assetLocMaintenance: string
 assetLocClass101: string
 assetLocClass102: string
 assetLocClass201: string
 assetLocOutdoor: string




  no_active_subscription_title: string;
  no_active_subscription_desc: string;
  no_active_subscription_logout: string;
}

export const translations: Record<string, Translation> = {
  en: {
    editAdminDesc2: "Update the details for the selected staff member.",
    // Navigation & Common
    no_active_subscription_title: "Subscription Inactive",
    no_active_subscription_desc: "Your school does not have an active subscription. Please contact the administrator.",
    no_active_subscription_logout: "Logout",
    dashboard: "Dashboard",
    settings: "Settings",
    logout: "Logout",
    welcome: "Welcome",
    loading: "Loading...",
    gettingReady: "Getting things ready...",

    // Login Page
    welcomeTo: "Welcome to",
    directis360: "Directis 360",
    streamlinedDashboards:
      "Streamlined dashboards for headmasters, teachers, students, and parents — all in one secure platform.",
    signIn: "Sign In",
    accessDashboard: "Access your scholar dashboard",
    identificator: "Identificator",
    enterIdentificator: "Enter your identificator",
    password: "Password",
    enterPassword: "Enter your password",
    signingIn: "Signing in...",
    headmasterUpgrade: "Are you a headmaster and want to upgrade your school?",
    joinUs: "Join us",

    // Role Selection
    selectRole: "Select your role to access the dashboard",
    accessDashboard2: "Access Dashboard",
    needHelp: "Need help? Contact your system administrator or",
    contactAdmin: "Contact Administrator",
    viewDocumentation: "view documentation",

    // Roles
    bossHeadmaster: "Boss / Headmaster",
    bossHeadmasterDesc: "Complete school management and administration",
    staffAdmin: "Staff / Admin",
    staffAdminDesc: "Administrative roles and management",
    teacher: "Teacher",
    teacherDesc: "Teaching and student management",
    student: "Student",
    studentDesc: "Student portal and information",
    parent: "Parent",
    parentDesc: "Parent portal and child monitoring",

    // Features
    createAdminAccounts: "Create admin accounts",
    setTabPasswords: "Set tab passwords",
    viewAnalytics: "View analytics",
    manageSchoolSettings: "Manage school settings",
    pedagogyManagement: "Pedagogy management",
    financeTracking: "Finance tracking",
    attendanceMonitoring: "Attendance monitoring",
    assetsManagement: "Assets management",
    manageStudentGroups: "Manage student groups",
    enterGrades: "Enter grades",
    markAttendance: "Mark attendance",
    viewSchedule: "View schedule",
    viewGrades: "View grades",
    checkSchedule: "Check schedule",
    groupInformation: "Group information",
    communityAccess: "Community access",
    childProgress: "Child progress",
    paymentTracking: "Payment tracking",
    busTracking: "Bus tracking",
    receiveAlerts: "Receive alerts",

    // Header
    welcomeBack: "Welcome back!",
    thisIsYourDashboard: "this is your dashboard.",
    refreshingData: "Refreshing data...",
    signedInAs: "Signed in as",

    // Sidebar
    managementSystem: "Management System",

    
    // Admin Management Page
    adminManagementTitle: "Admin Staff Management",     
    adminManagementDesc: "Create and manage admin staff accounts",
    addAdmin: "Add Admin",
    adminStaffMembers: "Admin Staff Members",
    adminStaffMembersDesc: "A list of all staff members with administrative access.",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    phone: "Phone",
    createdAt: "Created At",
    actions: "Actions",
    loadingAdminData: "Loading admin data...",
    noAdminsFound: "No admin staff members found.",
    successTitle: "Success",
    createNewAdmin: "Create New Admin",
    editAdmin: "Edit Admin",
    createNewAdminDesc: "Fill in the details to create a new staff account.",
    editAdminDesc: "Update the details for the selected staff member.",
    leaveBlank: "Leave blank to keep current",
    phoneNumber: "Phone Number",
    cancel: "Cancel",
    createAdmin: "Create Admin",
    saveChanges: "Save Changes",
    adminCreated: "Admin staff member created successfully!",
    adminUpdated: "Admin staff member updated successfully!",
    passwordTooShort: "Password is required and must be at least 8 characters long.",
    newPasswordTooShort: "New password must be at least 8 characters long.",
    authFailed: "Authentication failed.",
    unknownError: "An unknown error occurred.",

  // Tab Password Manager Page
tabPasswordManagementTitle: "Tab Password Management",
tabPasswordManagementDesc: "Set and manage passwords for different admin sections",
success: "Success",
passwordUpdated: "Password updated successfully!",
loadingPasswordSettings: "Loading Password Settings...",
passwordStatus: "Password Status",
passwordStatusCount: " admin roles have passwords set",
configured: "Configured",

// Tabs
tabPedagogy: "Pedagogy",
tabPedagogyDesc: "Manage students, teachers, groups, and schedules",
tabFinance: "Finance",
tabFinanceDesc: "Handle payments, salaries, and financial tracking",
tabAttendance: "Attendance",
tabAttendanceDesc: "Track employee attendance and presence",
tabAssets: "Assets",
tabAssetsDesc: "Manage school equipment and inventory",

// Status
set: "Set",
notSet: "Not Set",

// Buttons
updatePassword: "Update Password",
setPassword: "Set Password",

// Important
importantLabel: "Important:",
importantNotice: "These passwords will be required for staff to access their respective sections. Share them securely.",

// Dialog
setPasswordFor: "Set Password for {name}",
updatePasswordFor: "Update Password for {name}",
createPasswordDesc: "Create a secure password for this admin section.",
updatePasswordDesc: "Update the password for this admin section.",
newPassword: "New Password",
confirmPassword: "Confirm Password",
enterPasswordPlaceholder: "Enter password (min. 6 characters)",
confirmPasswordPlaceholder: "Confirm new password",

// Errors
passwordCannotBeEmpty: "Password cannot be empty",
passwordTooShort4: "Password must be at least 4 characters long",
passwordsNotMatch: "Passwords do not match",
authTokenNotFound: "Authentication token not found.",
couldNotLoadStatuses: "Could not load password statuses from the server.",


// Analytics Dashboard Page
financialSummary: "Financial Summary",
financialSummaryDesc: "A summary of all-time financial activity.",
totalIncome: "Total Income",
totalExpenses: "Total Expenses",
netProfit: "Net Profit",
goToFinanceDashboard: "Go to Finance Dashboard For Full Financial Details",

academicPerformanceTitle: "Academic Performance by Group",
academicPerformanceDesc: "Average grades and student counts for each academic group.",
level: "Level",
speciality: "Speciality",
studentCount: "Student Count",
averageGrade: "Average Grade",
gradeOutOf: "/ 20",


schoolVitals: "School Vitals",
activeGroups: "Active Groups",
unassignedStudents: "Unassigned Students",

attendanceLast30Days: "Attendance (Last 30 Days)",
workerAttendance: "Worker Attendance",
studentAbsenceHotspots: "Student Absence Hotspots",
absences: "absences",

topTeachers: "Top Teachers",
topTeachersDesc: "By number of assigned groups",
groups: "Groups",


// Add Asset Page
addAsset: "Add Asset",
addNewAssets: "Add New Asset(s)",
addAssetsDesc: "Fill in the details below to add assets to your school inventory.",
adding: "Adding...",
addAssetSingle: "Add Asset",
addAssetMultiple: "Add {quantity} Assets",

essentialInfo: "Essential Information",
essentialInfoDesc: "Required details for every asset",
assetName: "Asset Name *",
assetNamePlaceholder: "e.g., PC de Bureau, Chaise d'étudiant",
category: "Category *",
selectCategory: "Select category",
location: "Location *",
selectLocation: "Select location",
quantity: "Quantity *",
ownership: "Ownership *",
ownershipSchool: "School Owned",
ownershipLeased: "Leased",
ownershipDonated: "Donated",
ownershipBorrowed: "Borrowed",

multipleAssetsLabel: "Multiple Assets:",
multipleAssetsDesc: "items will be created with incrementing names ",

optionalDetails: "Optional Details",
optionalDetailsDesc: "Extra information for better tracking",
serialNumber: "Serial Number",
serialNumberPlaceholder: "e.g., SN00123AD",
purchaseDate: "Purchase Date",
purchasePrice: "Purchase Price (per unit) (DZD)",
totalCost: "Total cost: {amount} DZD",
description: "Description / Notes",
descriptionPlaceholder: "e.g., Modèle i5, 8GB RAM, 256GB SSD",

toastSuccess: "Successfully added {quantity} asset(s)!",
failedAddAsset: "Failed to add asset. Please try again.",


assetCategories: "Asset Categories",
assetCategoriesDesc: "Browse assets organized by category from A to Z",
searchCategoriesAssets: "Search categories or assets...",

items: "items",
totalValue: "Total Value:",
activeLabel: "Active:",
schoolOwnedLabel: "School Owned:",
recentItems: "Recent items:",
moreItems: " more items",

noCategories: "No categories found",
noAssetsYet: "No assets have been added yet",
tryAdjustSearch: "Try adjusting your search criteria",

categoryAssets: "{category} Assets",
categorySummary: " items • Total value: DZD ",

summaryActive: "Active",
summaryGoodCondition: "Good Condition",
summaryNeedAttention: "Need Attention",
summarySchoolOwned: "School Owned",

value: "Value:",
assignedTo: "Assigned to:",
serial: "Serial:",

conditionExcellent: "Excellent",
conditionGood: "Good",
conditionFair: "Fair",
conditionPoor: "Poor",
conditionNeedsRepair: "Needs Repair",

statusActive: "Active",
statusInactive: "Inactive",
statusMaintenance: "Maintenance",
statusDisposed: "Disposed",


totalAssets: "Total Assets",
activeAssets: " active assets",
depreciation: " depreciation",
maintenanceAlerts: "Maintenance Alerts",
overdueTasks: "Overdue tasks",

assetConditionDistribution: "Asset Condition Distribution",

recentActivities: "No Recent Activities",
maintenanceCompleted: "Maintenance completed for ",
newAssetAdded: "New asset added: ",
completed: "Completed",
added: "Added",
noRecentActivities: "No recent activities",



    // ===== Assets Settings Page =====
    settingsSaved: "Settings saved successfully!",

    generalSettings: "General Settings",
    generalSettingsDesc: "Configure global asset management preferences",
    defaultDepRate: "Default Depreciation Rate (%)",
    annualDepRateHint: "Annual depreciation rate for new assets",
    maintenanceReminder: "Maintenance Reminder (days)",
    maintenanceReminderHint: "Days before maintenance due to show alerts",
    lowValueThreshold: "Low Value Threshold ($)",
    lowValueThresholdHint: "Assets below this value are considered low-value",
    defaultMaintenanceInterval: "Default Maintenance Interval (months)",
    defaultMaintenanceIntervalHint: "Default time between maintenance schedules",

    autoUpdateValues: "Auto-update Asset Values",
    autoUpdateValuesDesc: "Automatically calculate depreciated values",
    maintenanceAlertsDesc: "Show notifications for upcoming maintenance",
    lowValueTracking: "Track Low-Value Assets",
    lowValueTrackingDesc: "Include assets below threshold in tracking",
    barcodeScanning: "Enable Barcode Scanning",
    barcodeScanningDesc: "Use barcode/QR codes for asset identification",
    assetTransfers: "Enable Asset Transfers",
    assetTransfersDesc: "Allow moving assets between locations",
    disposalApproval: "Require Approval for Disposal",
    disposalApprovalDesc: "Assets must be approved before disposal",
    saveSettings: "Save Settings",


    addCategory: "Add Category",
    active: "Active",
    inactive: "Inactive",
    depRate: "Depreciation Rate:",
    annually: "annually",
    maintenanceInterval: "Maintenance Interval:",
    months: "months",
    deactivate: "Deactivate",
    activate: "Activate",
    addCategoriesHint: "Add categories to organize your assets",

    dataManagement: "Data Management",
    dataManagementDesc: "Import, export, and backup your asset data",
    exportData: "Export Data",
    importData: "Import Data",
    dataNotice: "Data Management Notice",
    dataNoticeDesc:
      "Importing data will overwrite existing records. Make sure to export your current data as a backup before importing.",

    addAssetCategory: "Add Asset Category",
    addAssetCategoryDesc: "Create a new category for organizing assets",
    categoryName: "Category Name *",
    categoryDescription: "Description",
    depRatePercent: "Depreciation Rate (%)",
    maintenanceIntervalMonths: "Maintenance Interval (months)",


    placeholderCategoryName: "e.g., Sports Equipment",
    placeholderCategoryDesc: "Brief description of this category...",

    editAssetCategory: "Edit Asset Category",
    editAssetCategoryDesc: "Update category information",

    alertEnterCategoryName: "Please enter a category name",
    alertDeleteCategoryConfirm:
      "Are you sure you want to delete this category? This action cannot be undone.",
    alertImportSuccess: "Data imported successfully!",
    alertImportError: "Error importing data. Please check the file format.",

    maintenanceAlerts1: "Enable Maintenance Alerts",
    maintenanceAlertsDesc1: "Show notifications for upcoming maintenance",
    assetCategoriesDesc1: "Manage asset categories and their default settings",
    noCategories1: "No categories configured",



    inventory_title: "Asset Inventory",
    inventory_description: "Manage, filter, and track your school assets.",
    refresh: "Refresh",
    add_asset: "Add Asset",
    search_assets: "Search assets...",
    all_categories: "All Categories",
    all_conditions: "All Conditions",
    all_statuses: "All Statuses",
    no_assets_found: "No assets found.",
    try_adjusting_filters: "Try adjusting your filters.",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    confirm_delete_asset: "Are you sure you want to delete this asset?",
    asset_details_category: "Category",
    asset_details_location: "Location",
    asset_details_serial: "Serial Number",
    asset_details_purchase_date: "Purchase Date",
    asset_details_purchase_price: "Purchase Price",
    asset_details_ownership: "Ownership",
    add_new_asset: "Add New Asset",
    edit_asset: "Edit Asset",
    asset_name: "Name",
    asset_category: "Category",
    asset_location: "Location",
    asset_serial_number: "Serial Number",
    asset_purchase_date: "Purchase Date",
    asset_purchase_price: "Purchase Price",
    asset_condition: "Condition",
    asset_status: "Status",
    asset_ownership: "Ownership",
    ownership_school_owned: "School Owned",
    ownership_leased: "Leased",
    ownership_donated: "Donated",
    ownership_borrowed: "Borrowed",
    condition_excellent: "Excellent",
    condition_good: "Good",
    condition_fair: "Fair",
    condition_poor: "Poor",
    condition_needs_repair: "Needs Repair",
    status_active: "Active",
    status_inactive: "Inactive",
    status_maintenance: "Maintenance",
    status_disposed: "Disposed",
    save: "Save",


    maint_title: "Maintenance Tracking",
    maint_desc: "Schedule, track, and manage all asset maintenance tasks.",
    maint_new_btn: "New Maintenance",
    maint_filters_status: "Filter by Status",
    maint_filters_type: "Filter by Type",
    maint_filters_priority: "Filter by Priority",
    maint_no_records: "No maintenance records found.",

    maint_status_all: "All Statuses",
    maint_status_scheduled: "Scheduled",
    maint_status_inprogress: "In-Progress",
    maint_status_completed: "Completed",
    maint_status_overdue: "Overdue",

    maint_type_all: "All Types",
    maint_type_routine: "Routine",
    maint_type_repair: "Repair",
    maint_type_inspection: "Inspection",

    maint_priority_all: "All Priorities",
    maint_priority_low: "Low",
    maint_priority_medium: "Medium",
    maint_priority_high: "High",
    maint_priority_urgent: "Urgent",

    maint_schedule_title: "Schedule Maintenance",
    maint_edit_title: "Edit Maintenance",
    maint_asset_label: "Asset",
    maint_asset_placeholder: "Select Asset...",
    maint_date_label: "Scheduled Date",
    maint_type_label: "Type",
    maint_type_placeholder: "Select Type",
    maint_priority_label: "Priority",
    maint_priority_placeholder: "Select Priority",
    maint_description_label: "Description",
    maint_description_placeholder: "Describe the maintenance task...",

    maint_btn_cancel: "Cancel",
    maint_btn_save: "Save",
    maint_btn_edit: "Edit",
    maint_btn_delete: "Delete",


    search_assets_title: "Search Assets",
    search_assets_desc: "Find and filter assets using advanced search criteria",
    search_assets_placeholder: "Search by name, category, location, serial number, manufacturer, model, or notes...",
    search_assets_filters_btn: "Filters",
    search_assets_export_btn: "Export",

    search_assets_adv_filters: "Advanced Filters",
    search_assets_clear_all: "Clear All",

    search_assets_category_label: "Category",
    search_assets_condition_label: "Condition",
    search_assets_status_label: "Status",
    search_assets_location_label: "Location",
    search_assets_price_label: "Price Range",
    search_assets_date_label: "Purchase Date",
    search_assets_assigned_label: "Assigned To",

    search_assets_category_all: "All Categories",
    search_assets_condition_all: "All Conditions",
    search_assets_status_all: "All Status",
    search_assets_location_all: "All Locations",
    search_assets_price_all: "All Prices",
    search_assets_date_all: "All Dates",

    search_assets_condition_excellent: "Excellent",
    search_assets_condition_good: "Good",
    search_assets_condition_fair: "Fair",
    search_assets_condition_poor: "Poor",
    search_assets_condition_needsrepair: "Needs Repair",

    search_assets_status_active: "Active",
    search_assets_status_inactive: "Inactive",
    search_assets_status_maintenance: "Maintenance",
    search_assets_status_disposed: "Disposed",

    search_assets_price_under100: "Under $100",
    search_assets_price_100_500: "$100 - $500",
    search_assets_price_500_1000: "$500 - $1,000",
    search_assets_price_1000_5000: "$1,000 - $5,000",
    search_assets_price_over5000: "Over $5,000",

    search_assets_date_lastmonth: "Last Month",
    search_assets_date_last3months: "Last 3 Months",
    search_assets_date_last6months: "Last 6 Months",
    search_assets_date_lastyear: "Last Year",
    search_assets_date_overyear: "Over 1 Year",

    search_assets_results_found: "Found",
    search_assets_results_found_asset: "asset",
    search_assets_results_value: "Total value:",

    search_assets_no_results_title: "No assets found",
    search_assets_no_results_empty: "No assets have been added to the inventory yet",
    search_assets_no_results_try: "Try adjusting your search criteria or filters",
    search_assets_clear_btn: "Clear Search & Filters",

    search_assets_details_title: "Asset Details",
    search_assets_details_desc: "Complete information about this asset",

    search_assets_details_name: "Asset Name",
    search_assets_details_category: "Category",
    search_assets_details_condition: "Condition",
    search_assets_details_status: "Status",
    search_assets_details_location: "Location",
    search_assets_details_assigned: "Assigned To",
    search_assets_details_purchase_date: "Purchase Date",
    search_assets_details_purchase_price: "Purchase Price",
    search_assets_details_current_value: "Current Value",
    search_assets_details_serial: "Serial Number",
    search_assets_details_manufacturer: "Manufacturer",
    search_assets_details_model: "Model",
    search_assets_details_warranty: "Warranty",
    search_assets_details_last_maintenance: "Last Maintenance",
    search_assets_details_next_maintenance: "Next Maintenance",
    search_assets_details_notes: "Notes",
    search_assets_details_purchased: "Purchased:",



    attendance_overview_title: "Attendance Overview",
    attendance_overview_desc: "View attendance statistics for a specific day.",

    attendance_select_date: "Select Date",
    attendance_department_label: "Department",
    attendance_all_departments: "All Departments",
    attendance_export_btn: "Export",
    attendance_exporting_btn: "Exporting...",

    attendance_loading: "Loading statistics...",

    attendance_daily_stats: "Daily Statistics",
    attendance_stat_total: "Total",
    attendance_stat_present: "Present",
    attendance_stat_absent: "Absent",
    attendance_stat_late: "Late",
    attendance_stat_justified: "Justified",
    attendance_stat_holiday_rest: "Holiday/Rest",
    attendance_stat_unmarked: "Unmarked",

    attendance_department_breakdown: "Department Breakdown",
    attendance_department_rate: "Rate",
    attendance_no_department_data: "No department data",

    attendance_records_day: "Records for Day",
    attendance_no_records: "No records found",
    attendance_unmarked_member: "Unnamed Member",

    attendance_status_present: "Present",
    attendance_status_absent: "Absent",
    attendance_status_late: "Late",
    attendance_status_justified: "Justified",
    attendance_status_holiday: "Holiday",
    attendance_status_rest: "Rest Day",
    attendance_status_unknown: "Unknown",

    attendance_pdf_title: "Attendance Report",
    attendance_pdf_date: "Date",
    attendance_pdf_department: "Department",
    attendance_pdf_generated: "Generated On",
    attendance_pdf_headers_name: "Name",
    attendance_pdf_headers_department: "Department",
    attendance_pdf_headers_role: "Role",
    attendance_pdf_headers_status: "Status",
    attendance_pdf_headers_time: "Time",
    attendance_pdf_headers_remarks: "Remarks",
    attendance_pdf_no_data: "No staff data to export.",



    tracking_daily_progress_title: "Daily Progress",
    tracking_daily_progress_desc: "Summary for the currently filtered staff members.",

    tracking_total_staff: "Total Staff",
    tracking_marked: "Marked",
    tracking_unmarked: "Unmarked",
    tracking_completion: "Completion",

    tracking_attendance_title: "Attendance Tracking",
    tracking_attendance_desc: "Select a date to mark or edit attendance records.",
    tracking_select_date: "Select Date",
    tracking_search_staff: "Search Staff",
    tracking_search_placeholder: "Search by name...",
    tracking_department: "Department",
    tracking_all_departments: "All Departments",
    tracking_filter_placeholder: "Filter...",

    tracking_save_btn: "Save Changes",
    tracking_saving_btn: "Saving...",

    tracking_staff_list: "Staff List",
    tracking_loading_records: "Loading records for ",

    tracking_status_label: "Status",
    tracking_showing_time: "Showing Time:",

    tracking_no_staff_found: "No staff members found",
    tracking_no_staff_filter: "No staff match your current filter criteria.",

    tracking_status_present: "Present",
    tracking_status_absent: "Absent",
    tracking_status_late: "Late",
    tracking_status_justified: "Justified",
    tracking_status_holiday: "Holiday",
    tracking_status_rest: "Rest Day",
    tracking_status_not_marked: "Not Marked",
    tracking_status_unknown: "Unknown",

    tracking_auth_missing: "Authentication token not found.",
    tracking_fetch_error: "Could not load attendance for this date.",
    tracking_save_success: "Attendance saved successfully!",
    tracking_save_error: "Failed to save changes. Please try again.",

    back_to_staff_roles: "Back to Staff Roles",
    retry: "Retry",
    error: "Error",
    loading_asset_data: "Loading asset data...",
    loading_staff_members: "Loading staff members...",
    loading_finance_data: "Loading finance data...",
    loading_overview: "Loading overview...",
    error_loading_dashboard: "Error loading dashboard:",
    coming_soon: "Coming Soon",
    this_section_is_under_construction: "This section is under construction.",


    parent_account: "Parent Account",
    children: "Children",
    active_account: "Active Account",
    children_overview: "Children Overview",
    quick_overview_of_your_children_academic_performance: "Quick overview of your children's academic performance",
    overall_grade: "Overall Grade",
    absences_lates: "Absences / Lates",
    view_full_details: "View Full Details",
    overall_average: "Overall Average",
    lates: "Lates",
    teachers: "Teachers",
    full_report_for: "Full Report for",
    academic_marks: "Academic Marks",
    trimester: "Trimester",
    coefficient: "Coefficient",
    dev1: "Dev1",
    dev2: "Dev2",
    exam: "Exam",
    weekly_schedule: "Weekly Schedule",
    attendance_details: "Attendance Details",
    no_absences_or_lates_recorded: "No absences or lates recorded.",


    request_a_meeting: "Request a Meeting",
    select_teacher: "Select Teacher",
    academic_performance: "Academic Performance",
    behavioral_issues: "Behavioral Issues",
    attendance_issues: "Attendance Issues",
    health_and_wellbeing: "Health & Wellbeing",
    administrative_request: "Administrative Request",
    extracurricular_activities: "Extracurricular Activities",
    general_follow_up: "General Follow-up",
    conflict_resolution: "Conflict Resolution",
    date: "Date",
    notes: "Notes",
    send_request: "Send Request",
    your_meetings: "Your Meetings",
    cause: "Cause",
    requested: "Requested",
    scheduled: "Scheduled",
    confirm_new_date: "Confirm New Date",
    decline_reschedule: "Decline Reschedule",
    no_meetings_found: "No meetings found.",
    optional: "Optional", 
    refreshing_data: "Refreshing Data",


    staff_dashboard_title: "Staff Dashboard",
    staff_dashboard_loading: "Loading Dashboard...",

    staff_overview_title: "Staff Overview",
    staff_overview_desc: "Welcome to your staff dashboard",
    staff_overview_fullname: "Full Name",
    staff_overview_role: "Role",
    staff_overview_phone: "Phone",
    staff_overview_school: "School",

    staff_active_tab_title: "Active Tab Access",
    staff_active_tab_desc: "Only one protected tab can be unlocked at a time.",
    staff_active_tab_unlocked: "tab is currently unlocked.",
    staff_active_tab_none: "No tabs are currently unlocked.",
    staff_active_tab_hint: "Click a protected tab and enter the password to gain access.",
    staff_active_tab_go: "Go to Dashboard",
    staff_active_tab_revoke: "Revoke Access",

    staff_tab_access_granted_title: "Access Granted",
    staff_tab_access_granted_desc: "You can now proceed to the",
    section:"section",
    staff_tab_access_btn_go: "Go to ",
    staff_tab_access_btn_revoke: "Revoke Access",

    staff_tab_locked_message: "This section requires a password to unlock.",
    staff_tab_password_placeholder: "Enter password",
    staff_tab_password_error: "Incorrect password.",
    staff_tab_password_failed: "Failed to verify password",
    staff_tab_btn_unlock: "Unlock",
    staff_tab_btn_verifying: "Verifying...",
    staff_tab_manage_tasks: "Manage",
    staff_tab_related_tasks: "related tasks",



    staffrole_back_btn: "Back to Role Selection",
    staffrole_header_title: "Staff Administration",
    staffrole_header_subtitle: "Select your administrative role to continue",

    staffrole_password_status_title: "Password Protection Status",
    staffrole_password_status_count_prefix: "of",
    staffrole_password_status_count_suffix: " roles have passwords configured",
    staffrole_password_status_missing: "Contact the headmaster to set up missing passwords",

    staffrole_pedagogy_desc: "Student and teacher management",
    staffrole_pedagogy_feature1: "Create student accounts",
    staffrole_pedagogy_feature2: "Generate schedules and groups",
    staffrole_pedagogy_feature3: "Create teacher accounts",
    staffrole_pedagogy_feature4: "Link parent accounts",

    staffrole_finance_desc: "Financial tracking and management",
    staffrole_finance_feature1: "Employee financial tracking",
    staffrole_finance_feature2: "School income and outcome",
    staffrole_finance_feature3: "Add staff to database",
    staffrole_finance_feature4: "Track student payments",

    staffrole_attendance_desc: "Employee attendance monitoring",
    staffrole_attendance_feature1: "Track employee presence",
    staffrole_attendance_feature2: "Manual attendance marking",
    staffrole_attendance_feature3: "Attendance reports",
    staffrole_attendance_feature4: "Absence management",

    staffrole_assets_desc: "School equipment and inventory",
    staffrole_assets_feature1: "Equipment inventory",
    staffrole_assets_feature2: "Asset tracking",
    staffrole_assets_feature3: "Maintenance records",
    staffrole_assets_feature4: "Purchase management",

    staffrole_protected: "Protected",
    staffrole_no_password: "No Password",

    staffrole_btn_access_prefix: "Access",
    staffrole_btn_access_suffix: "Dashboard",
    staffrole_btn_password_required: "Password Required",

    staffrole_footer_question: "Don't have access to a role?",
    staffrole_footer_contact: "Contact the headmaster",

    staffrole_dialog_title_prefix: "Enter",
    staffrole_dialog_title_suffix: "Password",
    staffrole_dialog_desc: "This section is password protected. Please enter the password provided by the headmaster.",
    staffrole_dialog_password_label: "Password",
    staffrole_dialog_password_placeholder: "Enter password",
    staffrole_dialog_error_notset: "Password not set for this role. Please contact the headmaster.",
    staffrole_dialog_error_required: "Please enter a password",
    staffrole_dialog_error_incorrect: "Incorrect password. Please try again.",

    staffrole_dialog_btn_cancel: "Cancel",
    staffrole_dialog_btn_access: "Access Dashboard",
    staffrole_dialog_btn_verifying: "Verifying...",
    real_time_school_data: "Real-time school data",




    studentcomm_feed_title: "Community Feed",
    studentcomm_feed_subtitle: "View posts and participate in discussions.",

    studentcomm_btn_refresh: "Refresh",
    studentcomm_sorting_prefix: "sorting by:",
    studentcomm_sort_newest: "newest",
    studentcomm_sort_oldest: "oldest",

    studentcomm_filter_placeholder: "Filter by Teacher",
    studentcomm_filter_all: "All Teachers",

    studentcomm_error_title: "⚠ Error fetching posts",
    studentcomm_error_msg_prefix: "Something went wrong:",
    studentcomm_error_btn: "Try Again",

    studentcomm_noposts_title: "No posts found",
    studentcomm_noposts_desc: "Check back later for updates!",

    studentcomm_post_by_prefix: "By",
    studentcomm_post_attachments: "Attachments",
    studentcomm_post_view_replies_prefix: "View",
    studentcomm_post_view_replies_suffix: "replies",

    studentcomm_reply_you: "You",
    studentcomm_reply_teacher: "Teacher",
    studentcomm_reply_student: "Student",
    studentcomm_reply_author: "Author",
    studentcomm_reply_with_files: "this reply includes attachments only author can see",

    studentcomm_reply_placeholder_enabled: "Write a reply...",
    studentcomm_reply_placeholder_disabled:
      "Replying is not available for this post. The author may have disabled replies or limited the post to specific groups.",

    studentcomm_replyfile_remove: "Remove file",






    studentdash_loading: "Loading Student Data...",
    studentdash_error_title: "Could Not Load Data",
    studentdash_error_msg_prefix: "Error:",

    studentdash_sidebar_overview: "Overview",
    studentdash_sidebar_grades: "My Grades",
    studentdash_sidebar_schedule: "Schedule",
    studentdash_sidebar_group: "My Group",
    studentdash_sidebar_community: "Community",
    studentdash_sidebar_profile: "Profile",
    studentdash_header: "Student Dashboard",

    studentdash_overview_grade: "Overall Grade",
    studentdash_overview_attendance: "Attendance",
    studentdash_overview_subjects: "Subjects",
    studentdash_overview_recentgrades: "Recent Grades",
    studentdash_overview_nogrades: "No grades recorded yet for the first trimester.",
    studentdash_overview_todaysschedule: "Today's Schedule",
    studentdash_overview_noschedule: "No classes scheduled for today.",

    studentdash_grades_title: "Academic Performance",
    studentdash_grades_subtitle: "Your grades for the current academic year.",
    studentdash_grades_trimester_prefix: "Trimester",
    studentdash_grades_trimester_performance_prefix: " Performance",
    studentdash_grades_average: "Average",
    studentdash_grades_coeff: "Coefficient",
    studentdash_grades_finalgrade: "Final Grade",
    studentdash_grades_obs: "Observation",
    studentdash_grades_dev1: "Dev 1",
    studentdash_grades_dev2: "Dev 2",
    studentdash_grades_exam: "Exam",

    studentdash_schedule_title: "Weekly Schedule",
    studentdash_schedule_subtitle: "Your class timetable for this week",

    studentdash_group_title: "My Class Group",
    studentdash_group_subtitle: "Information about your class group and teachers",
    studentdash_group_level: "Level",
    studentdash_group_season: "Season",
    studentdash_group_yourteachers: "Your Teachers",
    studentdash_group_subject: "Subject",

    studentdash_profile_title: "Student Profile",
    studentdash_profile_subtitle: "Your personal and academic information.",
    studentdash_profile_personalinfo: "Personal Information",
    studentdash_profile_academicinfo: "Academic Information",
    studentdash_profile_parentinfo: "Parent Information",

    studentdash_profile_fullname: "Full Name",
    studentdash_profile_email: "Email Address",
    studentdash_profile_phone: "Phone Number",
    studentdash_profile_birthdate: "Birth Date",
    studentdash_profile_birthcity: "City of Birth",
    studentdash_profile_nationality: "Nationality",
    studentdash_profile_schooltype: "School Type",
    studentdash_profile_currentgroup: "Current Group",
    studentdash_profile_level: "Level",
    studentdash_profile_speciality: "Speciality",

    studentdash_parent_mother: "Mother's Information",
    studentdash_parent_father: "Father's Information",
    studentdash_parent_notavail_mother: "Mother's information not available.",
    studentdash_parent_notavail_father: "Father's information not available.",
    Coeff: "Coeff",




    BTN_CREATE_POST: "Create Post",
    DIALOG_CREATE_TITLE: "Create a new post",
    DIALOG_CREATE_DESC: "Share an update with your students. Attach files and select groups to notify.",
    INPUT_POST_TITLE: "Post Title",
    INPUT_POST_CONTENT: "What's on your mind?",
    LABEL_VISIBLE_GROUPS: "Visible to Groups",
    LABEL_ATTACH_FILES: "Attach Files",
    UPLOAD_CLICK: "Click to upload",
    BTN_POST: "Post",
    BTN_POSTING: "Posting...",
  
    POST_EDIT: "Edit",
    POST_EDIT_TITLE: "Edit Post",
    POST_EDIT_DESC: "Update the title, content, or visibility groups for this post.",
    POST_EDIT_FIELD_TITLE: "Title",
    POST_EDIT_FIELD_CONTENT: "Content",
    POST_EDIT_VISIBLE_GROUPS: "Visible to Groups",
    POST_EDIT_CANCEL: "Cancel",
    POST_EDIT_SAVE: "Save Changes",
    POST_EDIT_SAVING: "Saving...",
  
    POST_BY: "By",
    POST_SELECTED_GROUPS: "Selected Groups :",
    POST_ATTACHMENTS: "Attachments",
    POST_VIEW_REPLIES: "View ",
    POST_VIEW_REPLIES_COUNT: "replies",
    POST_REPLY_PLACEHOLDER: "Write a reply...",
    POST_REPLY_YOU: "You",
    POST_REPLY_TEACHER: "Teacher",
    POST_REPLY_STUDENT: "Student",
    POST_REPLY_AUTHOR: "Author",
    POST_REPLY_DOWNLOAD_TITLE: "click to download",
  
    FEED_TITLE: "Community Feed",
    FEED_DESC: "Discussions, questions, and announcements.",
    FEED_REFRESH: "Refresh",
    FEED_ERROR_TITLE: "⚠ Error fetching posts",
    FEED_ERROR_DESC: "Something went wrong while loading posts.",
    FEED_TRY_AGAIN: "Try Again",
    FEED_NO_POSTS_TITLE: "No posts found",
    FEED_NO_POSTS_DESC: "Try changing filters or create a new post!",
    FEED_BTN_ALL: "All Posts",
    FEED_BTN_MINE: "My Posts",
    FEED_SORT_NEWEST: "Sort: Newest",
    FEED_SORT_OLDEST: "Sort: Oldest",





    teacher_dashboard_title: "Teacher Dashboard",
    teacher_dashboard_refresh: "Refresh",
    teacher_dashboard_loading: "Loading Teacher Dashboard...",
    teacher_dashboard_failed_title: "Failed to load data",
    teacher_dashboard_failed_login: "Please login again",
    teacher_dashboard_refreshing: "Refreshing Data...",

    teacher_overview_tab: "Overview",
    teacher_groups_tab: "My Groups",
    teacher_grades_tab: "Grades",
    teacher_attendance_tab: "Attendance",
    teacher_schedule_tab: "Schedule",
    teacher_community_tab: "Community",
    teacher_meetings_tab: "Meetings",
    teacher_profile_tab: "Profile",

    teacher_total_groups: "Total Groups",
    teacher_total_students: "Total Students",
    teacher_subjects: "Subjects",
    teacher_weeks_classes: "Week's Classes",
    teacher_todays_classes: "Today's Classes",
    teacher_todays_schedule: "Today's Schedule",
    teacher_no_classes_today: "No classes scheduled for today.",
    teacher_students: "students",

    teacher_groups_manage: "Manage your student groups and classes",
    teacher_groups_students_count: "{count} students",
    teacher_groups_view_details: "View Details",

    teacher_grades_manage: "Grade Management",
    teacher_grades_description: "Enter and manage student grades for your subjects",
    teacher_grades_trimester1: "Trimester 1",
    teacher_grades_trimester2: "Trimester 2",
    teacher_grades_trimester3: "Trimester 3",
    teacher_grades_enter: "Enter Grades",
    teacher_grades_view_report: "View Report",
    teacher_grades_class_average: "Class Average",

    teacher_attendance_manage: "Attendance Management",
    teacher_attendance_description: "Select a date for each group and mark student attendance",
    teacher_attendance_mark: "Mark Attendance",

    teacher_schedule_title: "My Teaching Schedule",
    teacher_schedule_description: "View your weekly teaching schedule",

    teacher_profile_refresh: "Refresh",
    teacher_profile_contact_admin: "You can always contact the administration to update your profile",
    teacher_profile_modules: "Modules",
    teacher_profile_no_modules: "No modules assigned yet",
    teacher_profile_current_groups: "Current Groups",
    teacher_profile_no_groups: "Not teaching any group",
    teacher_profile_history: "Teaching History",
    teacher_username: "Username",
    teacher_national_id: "National ID",

    teacher_groupdetails_title: "Group Details",
    teacher_groupdetails_info: "Detailed information about this group including students, performance, and statistics.",
    teacher_groupdetails_students: "Total Students",
    teacher_groupdetails_subject: "Subject",
    teacher_groupdetails_level: "Level",
    teacher_groupdetails_academic_year: "Academic Year",
    teacher_groupdetails_statistics: "Performance Statistics",
    teacher_groupdetails_distribution_excellent: "Excellent (16-20)",
    teacher_groupdetails_distribution_good: "Good (14-15.99)",
    teacher_groupdetails_distribution_average: "Average (10-13.99)",
    teacher_groupdetails_distribution_needs: "Needs Improvement (<10)",
    teacher_groupdetails_attendance_presence: "Presence",
    teacher_groupdetails_attendance_lateness: "Lateness",
    teacher_groupdetails_attendance_absence: "Absence",
    teacher_groupdetails_student_list: "Student List",
    teacher_groupdetails_student_list_desc: "All students enrolled in this group",
    teacher_groupdetails_status_active: "Active",
    teacher_groupdetails_quick_actions: "Quick Actions",
    teacher_groupdetails_export: "Export Group Data",

    teacher_modal_grades_title: "Enter Grades",
    teacher_modal_grades_description: "Enter grades for all students in this group.module: ",
    teacher_modal_grades_module: "Each student has 4 assessment grades plus a final grade.",
    teacher_modal_grades_close: "Close",
    teacher_modal_loading: "Loading...",

    teacher_attendance_modal_title: "Mark Attendance",
    teacher_attendance_modal_description: "Mark attendance for the selected date. Check the box for students who are present.",
    teacher_attendance_modal_mark: "Mark Attendance",
    teacher_attendance_modal_error: "Error while submitting attendance marks",
    teacher_attendance_modal_success: "Attendances have been successfully marked",
    teacher_student_name: "Student Name",
    teacher_constant_observation: "Constant Obs.",
    teacher_modal_grades_loading: "Loading Group grades Details",
    teacher_modal_grades_description1: "Enter grades for all students in this group. Each student has 4 assessment grades plus a final grade.",
    Loading_Group_Details: "Loading Group Details",
    teacher_groupdetails_group_name: "Group Name",
    teacher_groupdetails_active_students: "Active Students",
    teacher_groupdetails_grade_distribution: "Grade Distribution",
    teacher_groupdetails_attendance_overview: "Attendance Overview",
    teacher_groupdetails_class: "Class",
    teacher_session: "Session",
    teacher_select_session: "Select Session",
    teacher_notes_optional: "Notes (Optional)",
    Save_Attendance: "Save Attendance",




    teacher_dash_title: "Teacher Dashboard",
    teacher_active_status: "Active",

    teacher_total_groups1: "Total Groups",
    teacher_total_students1: "Total Students",
    teacher_subjects1: "Subjects",
    teacher_today_classes: "Today's Classes",
    teacher_today_schedule: "Today's Schedule",

    teacher_groups_tab_title: "My Groups",
    teacher_groups_tab_desc: "Manage your student groups and classes",
    teacher_groups_students_label: " students",
    teacher_groups_view_details1: "View Details",

    teacher_grades_tab_title: "Grade Management",
    teacher_grades_tab_desc: "Enter and manage student grades for your subjects",
    teacher_grades_class_avg: "Class Average:",
    teacher_grades_enter_btn: "Enter Grades",
    teacher_grades_view_report_btn: "View Report",

    teacher_attendance_tab_title: "Attendance Management",
    teacher_attendance_tab_desc: "Select a date for each group and mark student attendance",
    teacher_attendance_select_date: "Select Date for Attendance",
    teacher_attendance_selected_prefix: "Selected:",
    teacher_attendance_selected_suffix: "",
    teacher_attendance_for_date: "Attendance for selected date:",
    teacher_attendance_mark_btn: "Mark Attendance",
    teacher_attendance_view_report_btn: "View Report",
    teacher_attendance_present: "Present",
    teacher_attendance_absent: "Absent",
    teacher_attendance_late: "Late",
    teacher_attendance_excused: "Excused",
    teacher_attendance_notes_label: "Notes (Optional)",
    teacher_attendance_notes_placeholder: "Add any notes about today's attendance...",
    teacher_attendance_save_btn: "Save Attendance",

    teacher_schedule_tab_title: "My Teaching Schedule",
    teacher_schedule_tab_desc: "View your weekly teaching schedule",

    teacher_community_title: "School Community",
    teacher_community_desc: "Connect with colleagues and participate in school discussions",
    teacher_community_coming: "Community Features Coming Soon",
    teacher_community_subdesc: "Connect with other teachers, share resources, and participate in school discussions.",

    teacher_settings_title: "Teacher Settings",
    teacher_settings_desc: "Manage your profile and preferences",
    teacher_settings_personal_info: "Personal Information",
    teacher_settings_professional_info: "Professional Information",
    teacher_settings_account_actions: "Account Actions",
    teacher_settings_change_password: "Change Password",
    teacher_settings_update_profile: "Update Profile",
    teacher_settings_contact_admin: "Contact the administrator to update your profile information or change your password.",

    teacher_modal_grades_title_prefix: "Enter Grades -",
    teacher_modal_grades_title_suffix: "",
    teacher_modal_grades_desc: "Enter grades for all students in this group. Each student has 4 assessment grades plus a final grade.",
    teacher_modal_student_name: "Student Name",
    teacher_modal_const_obs: "Constant Obs.",
    teacher_modal_dev1: "Dev 1",
    teacher_modal_dev2: "Dev 2",
    teacher_modal_exam: "Exam",
    teacher_modal_final_grade: "Final Grade",
    teacher_modal_actions: "Actions",
    teacher_modal_cancel: "Cancel",
    teacher_modal_save_all: "Save All Grades",

    teacher_modal_attendance_title_prefix: "Mark Attendance -",
    teacher_modal_attendance_title_suffix: "",
    teacher_modal_attendance_desc: "Mark attendance for the selected date. Check the box for students who are present.",
    teacher_modal_attendance_class: "Class:",
    teacher_modal_attendance_date: "Date:",
    teacher_modal_attendance_subject: "Subject:",
    teacher_modal_attendance_present: "Present:",
    teacher_modal_attendance_absent: "Absent:",
    teacher_modal_attendance_total: "Total:",
    teacher_modal_attendance_close: "Close",

    teacher_modal_report_title_prefix: "Class Report -",
    teacher_modal_report_title_suffix: "",
    teacher_modal_report_desc: "Comprehensive performance and attendance report for this class.",
    teacher_modal_report_total_students: "Total Students",
    teacher_modal_report_class_avg: "Class Average",
    teacher_modal_report_attendance_rate: "Attendance Rate",
    teacher_modal_report_pass_rate: "Pass Rate",
    teacher_modal_report_distribution: "Grade Distribution",
    teacher_modal_report_student_perf: "Individual Student Performance",
    teacher_modal_report_close: "Close",
    teacher_modal_report_export: "Export Report",

    teacher_modal_group_title_prefix: "Group Details -",
    teacher_modal_group_title_suffix: "",
    teacher_modal_group_desc: "Detailed information about this group including students, performance, and statistics.",
    teacher_modal_group_info: "Group Information",
    teacher_modal_group_students: "Total Students:",
    teacher_modal_group_subject: "Subject:",
    teacher_modal_group_level: "Level:",
    teacher_modal_group_year: "Academic Year:",
    teacher_modal_group_active_students: "Active Students:",
    teacher_modal_group_inactive_students: "Inactive Students:",
    teacher_modal_group_room: "Room",
    teacher_modal_group_stats: "Performance Statistics",
    teacher_modal_group_grade_dist: "Grade Distribution",
    teacher_modal_group_attendance_overview: "Attendance Overview",
    teacher_modal_group_student_list: "Student List",
    teacher_modal_group_student_list_desc: "All students enrolled in this group",
    teacher_modal_group_status_active: "Active",
    teacher_modal_group_quick_actions: "Quick Actions",
    teacher_modal_group_enter_grades: "Enter Grades",
    teacher_modal_group_mark_attendance: "Mark Attendance",
    teacher_modal_group_view_report: "View Report",
    teacher_modal_group_close: "Close",
    teacher_modal_group_export: "Export Group Data",
    experience: "Experience",
    qualification: "Qualification",
    teacher_modal_attendance: "Attendance",
    teacher_modal_group_name: "Group Name",
    teacher_modal_group_distribution_excellent1: "Excellent (95-100%)",
    teacher_modal_group_distribution_good1: "Good (85-94%)",
    teacher_modal_group_distribution_average1: "Average (75-84%)",
    teacher_modal_group_distribution_needs1: "Poor (&lt;75%)",
    Current_Grade: "Current Grade",



    teacher_meetings_request_title: "Request a Meeting",
    teacher_meetings_select_parent: "Select Parent",
    teacher_meetings_search_placeholder: "Search parent or child...",
    teacher_meetings_choose_parent: "Choose Parent",

    teacher_meetings_cause_label: "Cause",
    teacher_meetings_select_cause: "Select Cause",
    teacher_meetings_cause_academic: "Academic Performance",
    teacher_meetings_cause_behavioral: "Behavioral Issues",
    teacher_meetings_cause_attendance: "Attendance Issues",
    teacher_meetings_cause_health: "Health & Wellbeing",
    teacher_meetings_cause_admin: "Administrative Request",
    teacher_meetings_cause_extra: "Extracurricular Activities",
    teacher_meetings_cause_followup: "General Follow-up",
    teacher_meetings_cause_conflict: "Conflict Resolution",

    teacher_meetings_date_label: "Date",
    teacher_meetings_notes_label: "Notes (Optional)",
    teacher_meetings_notes_placeholder: "Add details for the meeting...",
    teacher_meetings_send_request: "Send Request",

    teacher_meetings_list_title: "Your Meetings",
    teacher_meetings_section_action_required: "Action Required",
    teacher_meetings_section_upcoming: "Upcoming Meetings",
    teacher_meetings_section_pending: "Pending Approval",
    teacher_meetings_section_archived: "Archived",

    teacher_meetings_with: "Meeting with:",
    teacher_meetings_by: "Meeting Request By:",
    teacher_meetings_cause_display: "Cause:",
    teacher_meetings_meeting_on: "Meeting on:",
    teacher_meetings_scheduled: "Scheduled:",
    teacher_meetings_notes: "Notes:",
    teacher_meetings_children: "Children:",

    teacher_meetings_btn_accept: "Accept",
    teacher_meetings_btn_decline: "Decline",
    teacher_meetings_btn_reschedule: "Reschedule",
    teacher_meetings_btn_confirm_date: "Confirm New Date",
    teacher_meetings_btn_decline_date: "Decline",

    teacher_meetings_empty: "No meetings found.",
    teacher_meetings_group: "Group:",




    student_dialog_add_title: "Add a New Student",
    student_dialog_edit_title: "Edit Student Information",
    student_dialog_add_desc: "Fill in the form to create a new student profile.",
    student_dialog_edit_desc_prefix: "Editing profile for",
    student_dialog_edit_desc_suffix: "",

    student_dialog_section_account: "Account Information",
    student_dialog_section_personal: "Personal Information",

    student_dialog_username: "Username",
    student_dialog_full_name: "Full Name",
    student_dialog_phone: "Phone Number",
    student_dialog_email: "Email",
    student_dialog_password: "Password",

    student_dialog_password_placeholder_new: "Enter password",
    student_dialog_password_placeholder_edit: "Leave blank to keep current password",
    student_dialog_show_password: "Show Password",
    student_dialog_hide_password: "Hide Password",

    student_dialog_nationality: "Nationality",
    student_dialog_birth_city: "Birth City",
    student_dialog_birth_date: "Birth Date",
    student_dialog_sex: "Sex",
    student_dialog_select_country: "Select country",
    student_dialog_select_city: "Select city",
    student_dialog_select_sex: "Select sex",
    student_dialog_male: "Male",
    student_dialog_female: "Female",

    student_dialog_error: "An error occurred while saving the form.",

    student_dialog_cancel: "Cancel",
    student_dialog_saving: "Saving...",
    student_dialog_update: "Update Student",
    student_dialog_add: "Add Student",
    student_dialog_group_history: "Group History",





    emp_finance_title: "Employee Finance",
    emp_finance_subtitle: "Manage salaries and track financial profiles for all staff and teachers.",

    emp_finance_total_employees: "Total Employees",
    emp_finance_finance_complete: "Finance Complete",
    emp_finance_pending_payroll: "Pending Payroll",
    emp_finance_estimated_payroll: "Est. Monthly Payroll",

    emp_finance_search_placeholder: "Search by name or position...",
    emp_finance_filter_department: "Filter by department",
    emp_finance_filter_status: "Filter by status",
    emp_finance_filter_all_departments: "All Departments",
    emp_finance_filter_all_statuses: "All Statuses",
    emp_finance_filter_done: "Complete",
    emp_finance_filter_pending: "Pending",
    emp_finance_filter_undone: "No Salary",

    emp_finance_add_staff_btn: "Add Staff",

    emp_finance_no_employee_title: "No Employees Found",
    emp_finance_no_employee_subtitle: "Try adjusting your search or filter criteria.",

    emp_finance_dialog_add_title: "Add New Staff",
    emp_finance_dialog_edit_title: "Edit Financial Profile",
    emp_finance_dialog_add_desc: "Fill in the details to add a new staff member to the payroll.",
    emp_finance_dialog_edit_desc: "Update the financial details for this employee.",

    emp_finance_form_name: "Full Name",
    emp_finance_form_position: "Position",
    emp_finance_form_department: "Department",
    emp_finance_form_hire_date: "Hire Date",
    emp_finance_form_salary: "Salary",
    emp_finance_form_bank_account: "Bank Account No.",
    emp_finance_form_status: "Employment Status",
    emp_finance_form_select_status: "Select status",
    emp_finance_form_status_active: "Active",
    emp_finance_form_status_inactive: "Inactive",

    emp_finance_btn_cancel: "Cancel",
    emp_finance_btn_save: "Save Changes",
    emp_finance_btn_create: "Create Profile",

    emp_finance_attendance_title: "Attendance Report For The Last 30 Days",
    emp_finance_attendance_desc_prefix: "30 Days Recorded Attendance for",
    emp_finance_attendance_desc_suffix: "",
    emp_finance_attendance_col_date: "Date",
    emp_finance_attendance_col_status: "Status",
    emp_finance_attendance_col_time: "Time",
    emp_finance_no_attendance: "No Attendance Records found for this employee.",

    emp_finance_transaction_title: "Transaction History",
    emp_finance_transaction_desc_prefix: "All recorded payments for",
    emp_finance_transaction_desc_suffix: "",
    emp_finance_transaction_col_date: "Date",
    emp_finance_transaction_col_desc: "Description",
    emp_finance_transaction_col_type: "Type",
    emp_finance_transaction_col_amount: "Amount",
    emp_finance_no_transactions: "No valid transactions found for this employee.",

    emp_finance_payroll_title: "Process Payroll",
    emp_finance_payroll_desc_prefix: "Apply tax and penalties before confirming salary payment for",
    emp_finance_payroll_desc_suffix: "",
    emp_finance_payroll_base_salary: "Base Salary",
    emp_finance_payroll_tax_percent: "Tax Percentage (%)",
    emp_finance_payroll_absence_penalty: "Absence Penalty",
    emp_finance_payroll_late_penalty: "Late Penalty",
    emp_finance_payroll_final_salary: "Final Salary",
    emp_finance_payroll_confirm_btn: "Confirm & Pay",

    emp_finance_profile_monthly_salary: "Monthly Salary",
    emp_finance_profile_last_payment: "Last Payment",
    emp_finance_profile_absence_report: "Absence Report",
    emp_finance_profile_not_set: "Not Set",
    emp_finance_profile_na: "N/A",

    emp_finance_profile_btn_view: "View",
    emp_finance_profile_btn_edit: "Edit",
    emp_finance_profile_btn_delete: "Delete",
    emp_finance_profile_btn_pay_salary: "Pay Salary",

    emp_finance_status_complete: "Complete",
    emp_finance_status_pending: "Pending",
    emp_finance_status_no_salary: "No Salary",

    emp_finance_attendance_present: "Present",
    emp_finance_attendance_absent: "Absent",
    emp_finance_attendance_late: "Late",
    emp_finance_attendance_justified: "Justified",
    emp_finance_attendance_holiday: "Holiday",
    emp_finance_attendance_rest: "Rest Day",
    emp_finance_attendance_unknown: "Unknown",




    fin_dash_title: "Finance Dashboard",
    fin_dash_subtitle: "A comprehensive overview of your institution's financial health.",

    fin_dash_period_label: "Select Period",
    fin_dash_period_overall: "Overall",
    fin_dash_period_select: "Select Period",

    fin_dash_stat_net_profit: "Net Profit",
    fin_dash_stat_total_income: "Total Income",
    fin_dash_stat_total_expenses: "Total Expenses",
    fin_dash_stat_profiles: "Registered Profiles",
    fin_dash_profiles_students: "Students",
    fin_dash_profiles_teachers: "Teachers",
    fin_dash_profiles_staff: "Staff / Employees",

    fin_dash_breakdown_title: "Financial Breakdown",
    fin_dash_breakdown_desc: "Breakdown of income and expenses for the selected period.",
    fin_dash_breakdown_income: "Income Sources",
    fin_dash_breakdown_expense: "Expense Categories",
    fin_dash_breakdown_no_income: "No income data available.",
    fin_dash_breakdown_no_expense: "No expense data available.",

    fin_dash_monthly_title: "Monthly Performance",
    fin_dash_monthly_desc: "Income vs. Expenses over the last months.",

    fin_dash_transactions_title: "Transactions",
    fin_dash_transactions_desc: "Latest 10 transactions for your school",
    fin_dash_transactions_search_placeholder: "Search...",
    fin_dash_transactions_type_placeholder: "Type",
    fin_dash_transactions_filter_all: "All",
    fin_dash_transactions_filter_income: "Income",
    fin_dash_transactions_filter_expense: "Expense",
    fin_dash_transactions_col_details: "Details",
    fin_dash_transactions_col_amount: "Amount",
    fin_dash_no_transactions_title: "No transactions found.",
    fin_dash_no_transactions_subtitle: "Try adjusting your filters.",

    fin_dash_no_data_title: "No Financial Data Available",
    fin_dash_no_data_desc: "No data returned from the server.",
    fin_dash_loading_msg: "Loading Financial Dashboard...",




    fin_set_title: "Finance Settings",
    fin_set_subtitle: "Configure finance system preferences and defaults",
    fin_set_save_btn: "Save Settings",
    fin_set_save_alert: "Settings saved successfully!",

    fin_set_general_title: "General Settings",
    fin_set_general_desc: "Basic finance system configuration",
    fin_set_currency_label: "Default Currency",
    fin_set_tax_label: "Tax Rate (%)",
    fin_set_payroll_label: "Payroll Frequency",
    fin_set_fiscal_label: "Fiscal Year Start",

    fin_set_student_title: "Student Payment Settings",
    fin_set_student_desc: "Configure student fee and payment options",
    fin_set_auto_reminder_label: "Automatic Payment Reminders",
    fin_set_auto_reminder_desc: "Send automatic reminders for upcoming and overdue payments",
    fin_set_late_fee_label: "Late Fee Amount",
    fin_set_late_fee_hint: "Amount charged for late payments ",
    fin_set_grace_label: "Grace Period (Days)",
    fin_set_grace_hint: "Days after due date before late fee is applied",

    fin_set_system_title: "System Information",
    fin_set_system_desc: "Current system status and information",
    fin_set_system_storage_label: "Data Storage",
    fin_set_system_storage_val: "Local browser storage",
    fin_set_system_updated_label: "Last Updated",

    fin_set_currency_list_usd: "US Dollar",
    fin_set_currency_list_eur: "Euro",
    fin_set_currency_list_gbp: "British Pound",
    fin_set_currency_list_cad: "Canadian Dollar",
    fin_set_currency_list_aud: "Australian Dollar",
    fin_set_currency_list_jpy: "Japanese Yen",
    fin_set_currency_list_cny: "Chinese Yuan",
    fin_set_currency_list_inr: "Indian Rupee",

    fin_set_payroll_weekly: "Weekly",
    fin_set_payroll_biweekly: "Bi-weekly",
    fin_set_payroll_monthly: "Monthly",
    fin_set_payroll_quarterly: "Quarterly",

    fin_set_fiscal_jan: "January",
    fin_set_fiscal_feb: "February",
    fin_set_fiscal_mar: "March",
    fin_set_fiscal_apr: "April",
    fin_set_fiscal_may: "May",
    fin_set_fiscal_jun: "June",
    fin_set_fiscal_jul: "July",
    fin_set_fiscal_aug: "August",
    fin_set_fiscal_sep: "September",
    fin_set_fiscal_oct: "October",
    fin_set_fiscal_nov: "November",
    fin_set_fiscal_dec: "December",




    inc_out_total_income: "Total Income",
    inc_out_total_expenses: "Total Expenses",
    inc_out_net_flow: "Net Flow",
    inc_out_search_placeholder: "Search transactions...",
    inc_out_from_label: "From",
    inc_out_to_label: "To",
    inc_out_add_btn: "Add",
    inc_out_record_title: "Record Transaction",
    inc_out_select_type_placeholder: "Select type",
    inc_out_type_income: "Income",
    inc_out_type_expense: "Expense",
    inc_out_amount_placeholder: "Amount",
    inc_out_description_placeholder: "Description",
    inc_out_save_btn: "Save",
    inc_out_no_payment_method: "N/A",
    inc_out_transaction_student_fees: "Student Fees: ",
    inc_out_transaction_salary: "Salary: ",

    emp_finance_missing_profiles: "Missing Financial Profiles",
    emp_finance_missing_profiles_desc: "Some students and teachers don’t yet have financial profiles. Create them to manage salaries and payments.",
    emp_finance_missing_profiles_desc_suffix: "",
    emp_finance_create_all: "Create All",
    emp_finance_all_profiles_created: "All Profiles Created",
    emp_finance_all_profiles_created_desc: "Every student and teacher has a financial profile.",





    staffdb_title: "Staff Database",
    staffdb_description:
      "Manage staff members without giving them system accounts. Store contact information and details.",
    staffdb_add_btn: "Add Staff Member",
    staffdb_add_new_title: "Add New Staff Member",
    staffdb_edit_title: "Edit Staff Member",
    staffdb_add_description: "Add a new staff member to the database",
    staffdb_edit_description: "Update staff member information",
    staffdb_label_fullname: "Full Name",
    staffdb_label_position: "Position",
    staffdb_label_department: "Department",
    staffdb_label_phone: "Phone Number",
    staffdb_label_email: "Email Address",
    staffdb_label_address: "Address",
    staffdb_label_emergency: "Emergency Contact",
    staffdb_label_notes: "Notes",
    staffdb_placeholder_address: "Full address...",
    staffdb_placeholder_emergency: "Name and phone number",
    staffdb_placeholder_notes: "Additional information...",
    staffdb_btn_add_member: "Add Staff Member",
    staffdb_btn_update_member: "Update Staff Member",
    staffdb_btn_cancel: "Cancel",
    staffdb_search_placeholder: "Search staff members...",
    staffdb_btn_view: "View",
    staffdb_btn_edit: "Edit",
    staffdb_btn_delete: "Delete",
    staffdb_delete_confirm: "Are you sure you want to delete this staff member?",
    staffdb_no_staff_title: "No staff members found",
    staffdb_no_staff_add_text: "Start by adding your first staff member to the database",
    staffdb_no_staff_search_text: "No staff members match your search criteria",
    staffdb_add_first_btn: "Add First Staff Member",
    staffdb_total_staff: "Total Staff",
    staffdb_total_staff_desc: "Staff members in database",
    staffdb_departments: "Departments",
    staffdb_departments_desc: "Different departments",
    staffdb_recent_additions: "Recent Additions",
    staffdb_recent_additions_desc: "Added this week",
    staffdb_view_title: "Staff Member Details",
    staffdb_view_description_prefix: "Complete information about",
    staffdb_section_basic: "Basic Information",
    staffdb_section_contact: "Contact Information",
    staffdb_section_additional: "Additional Notes",
    staffdb_field_fullname: "Full Name",
    staffdb_field_position: "Position",
    staffdb_field_department: "Department",
    staffdb_field_added_date: "Added Date",
    staffdb_field_phone: "Phone Number",
    staffdb_field_email: "Email Address",
    staffdb_field_address: "Address",
    staffdb_field_emergency: "Emergency Contact",
    staffdb_field_notes: "Notes",
    staffdb_btn_close: "Close",
    staffdb_added_label: "Added:",
    staffdb_emergency_label_prefix: "Emergency:",





    stdpay_title: "Student Payments",
    stdpay_description: "Manage and track all student financial transactions.",
    stdpay_card_students: "Enrolled Students",
    stdpay_card_transactions: "Total Transactions",
    stdpay_card_revenue: "Total Revenue",
    stdpay_card_average: "Average Payment",
    stdpay_filter_placeholder: "Filter by status",
    stdpay_filter_all: "All Students",
    stdpay_filter_due: "⚠️ Payment Due",
    stdpay_filter_never: "Never Paid",
    stdpay_filter_monthly: "Monthly Plan",
    stdpay_filter_quarterly: "Quarterly Plan",
    stdpay_filter_yearly: "Yearly Plan",
    stdpay_search_placeholder: "Search students by name...",
    stdpay_status_paid: "Paid Up",
    stdpay_status_due: "Due Soon",
    stdpay_status_overdue: "Overdue",
    stdpay_status_never: "Never Paid",
    stdpay_plan_label: "Plan",
    stdpay_last_payment: "Last Payment",
    stdpay_next_due: "Next Due Date",
    stdpay_btn_record_payment: "Record Payment",
    stdpay_btn_view_details: "View Details",
    stdpay_no_students_title: "No Students Found",
    stdpay_no_students_text: "Try adjusting your search or filter criteria.",
    stdpay_dialog_record_title: "Record New Payment",
    stdpay_dialog_record_for_prefix: "For student:",
    stdpay_label_amount: "Amount",
    stdpay_label_description: "Description",
    stdpay_label_plan: "Plan",
    stdpay_label_method: "Method",
    stdpay_placeholder_amount: "Amount in ",
    stdpay_option_monthly: "Monthly",
    stdpay_option_quarterly: "Quarterly",
    stdpay_option_yearly: "Yearly",
    stdpay_option_cash: "Cash",
    stdpay_option_card: "Card",
    stdpay_option_bank: "Bank Transfer",
    stdpay_btn_save: "Save Payment",
    stdpay_btn_saving: "Saving...",
    stdpay_error_submit: "Failed to save payment. Please try again later.",
    stdpay_dialog_history_title: "Transaction History",
    stdpay_dialog_history_prefix: "All recorded payments for",
    stdpay_table_date: "Date",
    stdpay_table_desc: "Description",
    stdpay_table_plan: "Plan",
    stdpay_table_method: "Method",
    stdpay_table_amount: "Amount",
    stdpay_table_no_data: "No transactions found for this student.",
    stdpay_total_paid: "Total Paid:",






    school_settings_loading: "Loading School Settings...",
    school_settings_loading_text: "Loading School Settings...",
    school_settings_title: "School General Settings",
    school_settings_description:
      "Manage your school's core details and location. Changes saved here will be reflected across the platform.",
    school_settings_general_info: "General Information",
    school_settings_school_name: "School Name",
    school_settings_school_type: "School Type",
    school_settings_derivation_key: "Derivation Key",
    school_settings_location_coords: "Location Coordinates",
    school_settings_latitude: "Latitude (X)",
    school_settings_longitude: "Longitude (Y)",
    school_settings_drag_pin:
      "You can also set the location by dragging the pin on the map.",
    school_settings_location_map: "School Location Map",
    school_settings_error_auth: "Authentication failed.",
    school_settings_error_unknown: "An unknown error occurred.",
    school_settings_error_save: "Failed to save settings.",
    school_settings_success_update: "School settings updated successfully!",
    school_settings_save_changes: "Save Changes",







    signup_title: "Get Started with ",
    signup_title_suffix: "Directis ",
    signup_title_suffix_2: "360",
    signup_subtitle:
      "Join the growing network of schools transforming education in Algeria",
    signup_selected_plan: "Selected Plan:",
    signup_selected_plan_placeholder: "Select a Plan",
    signup_plan_includes: "What's included:",
    signup_plan_see_included: "See what's included",
    signup_school_info_title: "School Information",
    signup_school_info_desc:
      "Tell us about your school and we'll get you set up with the perfect plan",
    signup_fullname_label: "Full Name",
    signup_fullname_placeholder: "Enter your full name",
    signup_schoolname_label: "School Name",
    signup_schoolname_placeholder: "Enter your school name",
    signup_email_label: "Email Address",
    signup_email_placeholder: "school@example.com",
    signup_phone_label: "Phone Number",
    signup_phone_placeholder: "+213 XXX XXX XXX",
    signup_phone_desc: "We'll use this to contact you about your setup",
    signup_submit: "Get Started",
    signup_submitting: "Submitting...",
    signup_success_title: "Thank you for your interest!",
    signup_success_desc:
      "We've received your signup request and will contact you within 24 hours to get your school set up with Directis 360.",
    signup_submit_another: "Submit Another Request",
    signup_plan_starter_name: "Starter",
    signup_plan_starter_price: "1,500 DZD/student",
    signup_plan_starter_desc: "Perfect for small schools up to 100 students",
    signup_plan_prof_name: "Professional",
    signup_plan_prof_price: "3,000 DZD/month",
    signup_plan_prof_desc: "Ideal for most schools up to 300 students",
    signup_plan_enterprise_name: "Enterprise",
    signup_plan_enterprise_price: "Custom pricing",
    signup_plan_enterprise_desc:
      "For large institutions with unlimited students",
    signup_plan_feature_1: "Up to 100 students",
    signup_plan_feature_2: "Basic dashboards",
    signup_plan_feature_3: "Grade management",
    signup_plan_feature_4: "Advanced analytics",
    signup_plan_feature_5: "API access",
    signup_plan_feature_6: "Priority support",
    signup_plan_popular: "Popular",
    signup_logo_alt: "Directis Logo",
    signup_plan_more_features: "more features",








    gm_title: "Group Management",
    gm_subtitle_prefix: "Create and manage student groups for ",
    gm_subtitle_suffix: "your school",
    gm_btn_reload: "Reload",
    gm_btn_create_group: "Create Group",
    gm_btn_apply_season: "Apply Season Filter",
    gm_btn_clear: "Clear",
    gm_btn_cancel: "Cancel",
    gm_btn_create: "Create Group",
    gm_btn_view: "View",
    gm_btn_delete: "Delete",
    gm_btn_close: "Close",
    gm_alert_no_school_type_title: "School type not configured",
    gm_alert_no_school_type_desc:
      "Please configure the school type in Settings before managing groups.",
    gm_no_groups_title: "No Groups Found",
    gm_no_groups_desc_start: "Create your first group to get started",
    gm_no_groups_desc_filter: "Try adjusting your search filters",
    gm_no_groups_btn: "Create First Group",
    gm_filter_title: "Search & Filter",
    gm_search_placeholder: "Search groups by name",
    gm_filter_grade_placeholder: "Filter by grade",
    gm_filter_status_placeholder: "Filter by status",
    gm_filter_all_levels: "All Levels",
    gm_filter_all_specialities: "All Specialities",
    gm_filter_start_year_placeholder: "Start Year (e.g., 2023)",
    gm_filter_end_year_placeholder: "End Year (e.g., 2026)",
    gm_filter_invalid_range: "Invalid range",
    gm_filter_currently_showing: "currently showing groups from season:",
    gm_create_title: "Create New Group",
    gm_create_desc_prefix: "Create a new student group for ",
    gm_create_desc_suffix: "the school",
    gm_loading: "Loading...",
    gm_academic_info: "Academic Information",
    gm_required_notice:
      "fields marked by",
      gm_required_notice_suffix: "are mandatory to fill",
    gm_school_level: "School Level",
    gm_configured_by: "(configured by headmaster)",
    gm_speciality_label: "Speciality",
    gm_select_speciality_placeholder: "Please select speciality",
    gm_level_label: "Level",
    gm_select_level_placeholder: "Select level",
    gm_select_speciality_first: "(Select speciality first)",
    gm_room_season_details: "Room & Season Details",
    gm_season_label: "Season",
    gm_select_season_placeholder: "Select season",
    gm_subject_assignment: "Subject Assignment",
    gm_subject_details_format: "{speciality} - {level} {suffix}",
    gm_coef_label: "Coef",
    gm_obligatory: "Obligatory",
    gm_optional: "Optional",
    gm_no_subjects_message:
      "Please select speciality and level to see available subjects",
    gm_error_general: "Failed to create group. Please try again.",
    gm_view_title: "Group Details",
    gm_view_desc_prefix: "Complete information about ",
    gm_basic_info: "Basic Information",
    gm_label_group_name: "Group Name",
    gm_label_school_type: "School Type",
    gm_label_speciality: "Speciality",
    gm_label_created_date: "Created Date",
    gm_modules_teachers: "Modules & Teachers",
    gm_teacher_assigned: "Teacher Assigned",
    gm_no_teacher: "No Teacher",
    gm_delete_title: "Delete Group?",
    gm_delete_warning:
      "Are you sure you want to delete this group? This action will remove:",
    gm_delete_list1: "All student registrations in this group",
    gm_delete_list2: "All teacher assignments for this group",
    gm_delete_list3: "All marks associated with this group",
    gm_delete_irreversible: "This action ",
    gm_delete_irreversible_desc: "cannot be undone.",
    gm_delete_cancel: "Cancel",
    gm_delete_confirm: "Delete",
    gm_deleting: "Deleting...",
    gm_label_room: "Room",
    gm_label_teachers: "Assigned Teachers",
    gm_label_created: "Created",


    

    

    mm_title_loading: "Loading all meetings...",
    mm_title_error: "Error fetching data",
    mm_error_description: "Failed to fetch meetings.",
    mm_retry_btn: "Retry",
    mm_no_meetings: "No meetings found.",

    mm_toast_error_load_title: "Error loading meetings",
    mm_toast_error_load_desc: "Unknown error while loading meetings",
    mm_toast_success_action: "Meeting updated successfully",
    mm_toast_error_action: "Failed to process meeting action",

    mm_confirm_delete: "Are you sure you want to permanently delete this meeting?",

    mm_section_action_required: "Action Required (New Requests)",
    mm_section_upcoming: "Upcoming & Scheduled",
    mm_section_reschedule: "Pending Reschedule",
    mm_section_archived: "Archived / Closed",

    mm_meeting_with: "Meeting with",
    mm_requested_on: "Requested on",
    mm_scheduled: "Scheduled",
    mm_notes: "Notes",

    mm_btn_approve: "Approve",
    mm_btn_decline: "Decline",
    mm_btn_confirm_reschedule: "Confirm Reschedule",
    mm_btn_delete: "Delete",

    mm_status_accepted: "Accepted / Completed",
    mm_status_declined: "Declined / Rejected",
    mm_status_inprogress: "Ongoing / Active",
    mm_status_pending: "Awaiting Review",







        // Tabs
        pm_tab_link_parent: "Link Parent to Student",
        pm_tab_create_parent: "Create New Parent",
    
        // Link tab
        pm_link_title: "Link Accounts",
        pm_link_description: "Connect an existing parent account to a student account.",
        pm_select_student_label: "Select Student",
        pm_select_student_placeholder: "Select a student...",
        pm_select_parent_label: "Select Parent",
        pm_select_parent_placeholder: "Select a parent...",
        pm_relationship_label: "Relationship to Student",
        pm_relationship_placeholder: "Select relationship",
        pm_relationship_father: "Father",
        pm_relationship_mother: "Mother",
        pm_error_select_both: "Please select both a parent and a student.",
        pm_error_auth_failed: "Authentication failed.",
        pm_success_linked: "Parent linked to student successfully!",
        pm_link_btn: "Link Accounts",
        pm_link_loading: "Linking...",
    
        // Create parent tab
        pm_create_title: "Create Parent Account",
        pm_create_description: "Create a new account for a parent. This can then be linked to one or more students.",
        pm_label_full_name: "Full Name",
        pm_label_email: "Email",
        pm_label_phone: "Phone Number",
        pm_label_nid: "National ID",
        pm_label_username: "Username",
        pm_label_password: "Password",
        pm_label_declared_relationship: "Declared Relationship",
        pm_success_create: "Parent account created successfully!",
        pm_error_create: "Creation failed.",
        pm_btn_create: "Create Parent",
        pm_btn_loading: "Creating...",
    
        // Alerts
        pm_alert_error_title: "Error",
        pm_alert_success_title: "Success",






        po_loading_text: "Loading Data...",

        po_title: "Pedagogy Overview",
        po_description: "A real-time summary of your school's academic operations.",
        po_back_btn: "Back to Main Dashboard",
    
        po_total_students: "Total Students",
        po_total_teachers: "Total Teachers",
        po_active_groups: "Active Groups",
        po_unassigned_students: "Unassigned Students",
        po_students_change: " new in last 30 days",
        po_teachers_change: " with assignments",
        po_groups_change_prefix: "For season ",
        po_unassigned_change: "Awaiting placement",
    
        po_enrollment_title: "Student Enrollment",
        po_enrollment_description: "Breakdown of registered vs. unassigned students.",
        po_registered_label: "Registered",
        po_unassigned_label: "Unassigned",
    
        po_level_title: "Student Level Distribution",
        po_level_description: "Number of registered students per academic level.",
        po_no_students_group: "No students assigned to groups yet.",
    
        po_top_teachers_title: "Top Teachers",
        po_top_teachers_description: "Teachers with the most group assignments.",
        po_no_teachers_group: "No teachers have been assigned to groups.",
        po_groups_label: " Groups",
    
        po_recent_title: "Recent Activities",
        po_recent_description: "Latest actions from the past 7 days.",
        po_no_activities: "No recent activities to show.",
        po_activity_new_student: "New student enrolled: ",
        po_activity_new_teacher: "New teacher added: ",
        po_activity_new_group: "New group created: ",
    
        po_quick_title: "Quick Actions",
        po_quick_description: "Get started with common tasks.",
        po_action_add_student_title: "Add New Student",
        po_action_add_student_desc: "Enroll a new student profile.",
        po_action_add_teacher_title: "Add New Teacher",
        po_action_add_teacher_desc: "Onboard a new teaching staff member.",
        po_action_create_group_title: "Create New Group",
        po_action_create_group_desc: "Form a new class or group for students.",
        po_action_assign_students_title: "Assign Students to Groups",
        po_action_assign_students_desc: "Manage student group assignments.",








        ps_title: "Pedagogy Settings",
        ps_description: "Configure pedagogy-specific preferences and rules for the Algerian education system",
    
        ps_tab_general: "General",
        ps_tab_grading: "Grading",
        ps_tab_subjects: "Subjects",
        ps_tab_groups: "Groups",
    
        ps_school_schedule_title: "School Schedule Settings",
        ps_school_schedule_desc: "Configure basic school timing and class structure",
        ps_start_time_label: "School Start Time",
        ps_end_time_label: "School End Time",
        ps_class_duration_label: "Class Duration (minutes)",
        ps_break_duration_label: "Break Duration (minutes)",
        ps_max_students_label: "Maximum Students per Group",
        ps_save_general_btn: "Save General Settings",
    
        ps_feature_title: "Feature Settings",
        ps_feature_desc: "Enable or disable pedagogy features",
        ps_parent_notif_label: "Parent Notifications",
        ps_parent_notif_desc: "Send notifications to parents about student progress",
        ps_attendance_label: "Attendance Tracking",
        ps_attendance_desc: "Track student attendance in classes",
        ps_grade_reports_label: "Grade Reports",
        ps_grade_reports_desc: "Generate and distribute grade reports",
    
        ps_grading_title: "Algerian Grading System Configuration",
        ps_grading_desc: "Set up grading rules and assessment settings according to Algerian standards",
        ps_system_label: "Grading System",
        ps_system_placeholder: "Select grading system",
        ps_system_20point: "20 Point System (Algerian Standard)",
        ps_system_letter: "Letter Grades (A-F)",
        ps_system_percentage: "Percentage",
        ps_system_passfail: "Pass/Fail",
        ps_passing_label: "Passing Grade",
        ps_passing_placeholder: "e.g., 10/20, 60%, C",
        ps_report_frequency_label: "Report Card Frequency",
        ps_report_frequency_placeholder: "Select frequency",
        ps_report_frequency_monthly: "Monthly",
        ps_report_frequency_quarterly: "Quarterly (Trimester)",
        ps_report_frequency_semester: "Semester",
        ps_report_frequency_annual: "Annual",
        ps_midterm_label: "Midterm Examinations",
        ps_midterm_desc: "Enable midterm exam periods (Contrôles)",
        ps_final_label: "Final Examinations",
        ps_final_desc: "Enable final exam periods (Examens)",
        ps_save_grading_btn: "Save Grading Settings",
    
        ps_subjects_title: "Subject Management",
        ps_subjects_desc: "Configure core and elective subjects from the Algerian curriculum",
        ps_core_label: "Core Subjects",
        ps_add_core_btn: "Add Core Subject",
        ps_elective_label: "Elective Subjects",
        ps_add_elective_btn: "Add Elective Subject",
        ps_weighting_label: "Subject Weighting (Coefficients)",
        ps_weighting_desc: "Enable different coefficients for subjects in grade calculation",
        ps_default_weight_label: "Default Subject Coefficient",
        ps_available_subjects_label: "Available Subjects from Algerian Curriculum ",
        ps_save_subjects_btn: "Save Subject Settings",
    
        ps_groups_title: "Group Configuration",
        ps_groups_desc: "Configure group creation and management rules for Algerian school system",
        ps_auto_create_label: "Automatic Group Creation",
        ps_auto_create_desc: "Automatically create groups when students are enrolled",
        ps_group_pattern_label: "Group Naming Pattern",
        ps_group_pattern_placeholder: "e.g., {grade} - Section {section}",
        ps_group_pattern_hint_prefix: "Use",
        ps_group_pattern_hint_prefix1: "and",
        ps_group_pattern_hint_suffix: "as placeholders. Example: 1AS - Section A",

        ps_mixed_label: "Mixed Grade Groups",
        ps_mixed_desc: "Allow students from different grades in the same group",
        ps_max_groups_label: "Maximum Groups per Teacher",
        ps_save_groups_btn: "Save Group Settings",
    
        ps_alert_status_prefix: "Settings Status:",
        ps_alert_status_suffix:
          "All pedagogy settings are configured for the Algerian education system (Primaire, CEM, Lycée). Changes are saved automatically.",









          sm_title: "Schedule Management",
          sm_description_prefix: "Select a group to manage its weekly class schedule for the current season",
          sm_description_suffix: "Season",
          sm_select_group_placeholder: "Select a group...",
      
          sm_group_schedule_title_prefix: "",
          sm_group_schedule_title_suffix: "Schedule",
          sm_level_label: "Level",
          sm_specialty_label: "Specialty",
      
          sm_clear_btn: "Clear Schedule",
          sm_save_btn: "Save Schedule",
          sm_preview_btn: "Preview",
          sm_export_btn: "Export PDF",
          sm_add_class_btn: "Add Class",
      
          sm_clear_dialog_title: "Are you sure?",
          sm_clear_dialog_description:
            "This will permanently delete all schedule entries for this group. This action cannot be undone.",
          sm_clear_dialog_cancel: "Cancel",
          sm_clear_dialog_confirm: "Yes, Clear Schedule",
      
          sm_loading_message: "Loading initial data...",
      
          sm_edit_class_title: "Edit Class",
          sm_add_class_title: "Add New Class",
          sm_dialog_desc: "Fill in the details for the class schedule entry.",
      
          sm_day_label: "Day",
          sm_day_placeholder: "Select day",
          sm_subject_label: "Subject",
          sm_subject_placeholder: "Select subject",
          sm_start_label: "Start Time",
          sm_start_placeholder: "Start time",
          sm_end_label: "End Time",
          sm_end_placeholder: "End time",
          sm_teacher_label: "Teacher",
          sm_teacher_placeholder: "Select teacher",
          sm_teacher_placeholder_no_subject: "Select subject first",
          sm_room_label: "Room",
          sm_room_placeholder: "e.g., Room 101, Lab A",
      
          sm_conflict_title: "Scheduling Conflict",
          sm_conflict_desc_group: "This time slot conflicts with another class for this group.",
          sm_conflict_desc_teacher:
            "This teacher is already scheduled for a class in another group at this time.",
          sm_conflict_desc_room: "This room is already booked for a class in another group at this time.",
      
          sm_cancel_btn: "Cancel",
          sm_update_btn: "Update Class",
          sm_add_btn: "Add Class",
          sm_delete_btn: "Delete",
      
          sm_preview_title_prefix: "Schedule Preview:",
          sm_preview_desc: "A read-only view of the weekly schedule.",
          sm_preview_close_btn: "Close",
      
          sm_pdf_title: "Class Schedule",
          sm_pdf_group: "Group",
          sm_pdf_specialty: "Specialty",
          sm_pdf_level: "Level",
          sm_pdf_season: "Season",
          sm_pdf_teachers_head: "Teaching Staff",
          sm_pdf_subjects_head: "Subjects",
          sm_pdf_day_head: "Day",
          sm_pdf_time_head: "Time",
          sm_clear_dialog_description1: "This will delete this class entry. This action is not saved until you click 'Save Schedule'.",






          sga_select_group_title: "Select Group",
          sga_select_group_desc: "Choose a group to manage assignments for the current season.",
          sga_select_group_placeholder: "Select a group...",
      
          sga_loading_message: "Loading student & group data...",
          sga_error_title: "Error",
      
          sga_assigned_members_title: "Assigned Members",
          sga_pending_assignments_title: "Pending Assignments",
          sga_current_members_title: "Current Members",
          sga_no_students_msg: "No students assigned to this group yet.",
      
          sga_available_students_title: "Available Students",
          sga_filter_unassigned: "Unassigned",
          sga_filter_registered: "Registered",
          sga_filter_group_placeholder: "Filter by group...",
          sga_filter_all_compatible: "All Compatible Groups",
          sga_search_placeholder: "Search students...",
          sga_in_label: "In:",
          sga_transfer_btn: "Transfer",
          sga_assign_btn: "Assign",
          sga_save_assignments_btn: "Save Assignments",
      
          sga_empty_state_title: "Select a Group",
          sga_empty_state_desc: "Choose a group to begin assigning students.",
      
          sga_transfer_confirm_title: "Confirm Student Transfer",
          sga_transfer_confirm_specialty_title: "Confirm Specialty Change",
          sga_transfer_confirm_warning_title: "Warning: This is a permanent action.",
          sga_transfer_confirm_warning_desc:
            "You are moving a student to a different specialty. Their marks from the old group will be archived, and they will start with a fresh record in the new group.",
          sga_transfer_confirm_desc_prefix: "Proceed with transferring",
          sga_transfer_confirm_desc_suffix: "to",
          sga_transfer_failed_title: "Transfer Failed",
          sga_transfer_cancel_btn: "Cancel",
          sga_transfer_confirm_btn: "Confirm Transfer",
      
          sga_unassign_confirm_title: "Confirm Unassignment",
          sga_unassign_warning_title: "Warning: This will archive student marks.",
          sga_unassign_warning_desc:
            "Unassigning this student will remove them from the group and permanently archive their current marks. This action is intended for withdrawals.",
          sga_unassign_confirm_desc_prefix: "Are you sure you want to unassign",
          sga_unassign_confirm_desc_suffix: "?",
          sga_unassign_failed_title: "Unassignment Failed",
          sga_unassign_cancel_btn: "Cancel",
          sga_unassign_confirm_btn: "Confirm Unassignment",
      
          sga_save_confirm_title: "Confirm New Assignments",
          sga_save_confirm_desc: "Review the new assignments before saving.",
          sga_save_new_assignments_title: "New Assignments:",
          sga_save_loading_msg: "Saving changes...",
          sga_save_success_msg: "Changes saved successfully!",
          sga_save_failed_title: "Save Failed",
          sga_save_cancel_btn: "Cancel",
          sga_save_confirm_btn: "Save",
          sga_save_retry_btn: "Retry",
          sga_save_close_btn: "Close",
          sga_transfer_confirm_desc_suffix2: "Their current marks will be moved with them.",
          sga_transfer_confirm_desc_suffix1: "to the group",
          sga_transfer_confirm_desc_prefix1: "Are you sure you want to transfer the student",









          sm_title1: "Student Management",
          sm_desc: "Add and manage students for",
          sm_reload_btn: "Refresh",
          sm_add_btn1: "Add Student",
      
          sm_search_filter_title: "Search & Filter",
          sm_search_placeholder: "Search by name, username, or email...",
          sm_filter_placeholder: "Filter by status",
          sm_filter_all: "All Students",
          sm_filter_registered: "Registered",
          sm_filter_not_registered: "Not Registered",
      
          sm_students_title: "Students",
          sm_students_desc: "Manage all students in the system",
          sm_no_students_title: "No students found",
          sm_no_students_desc_has_students: "Try adjusting your search filters",
          sm_no_students_desc_empty: "Add your first student to get started",
      
          sm_add_dialog_title: "Add New Student",
          sm_edit_dialog_title: "Edit Student",
          sm_dialog_desc1: "Fill in the details for the student.",
          sm_account_info_title: "Account Information",
          sm_personal_info_title: "Personal Information",
          sm_username: "Username",
          sm_full_name: "Full Name",
          sm_phone_number: "Phone Number",
          sm_email: "Email",
          sm_password: "Password",
          sm_password_placeholder_new: "Enter password",
          sm_password_placeholder_edit: "Leave blank to keep current password",
          sm_nationality: "Nationality",
          sm_sex: "Sex",
          sm_birth_date: "Birth Date",
          sm_birth_city: "Birth City",
          sm_select_country: "Select country",
          sm_select_city: "Select city",
          sm_select_sex: "Select sex",
          sm_male: "Male",
          sm_female: "Female",
          sm_cancel_btn1: "Cancel",
          sm_add_student_btn: "Add Student",
          sm_update_student_btn: "Update Student",
      
          sm_view_account_info: "Account Information:",
          sm_view_personal_info: "Personal Information:",
          sm_view_group_history: "Group History:",
          sm_registered_label: "Registered",
          sm_not_registered_label: "Not Registered",
          sm_speciality_label: "Speciality",
          sm_close_btn: "Close",
      
          sm_registered_status: "Registered",
          sm_not_registered_status: "Not Registered",
          sm_registered_with_group: "Registered ({groupName})",
      
          sm_error_auth_expired: "Authentication session has expired. Please refresh.",
          sm_error_unexpected: "An unexpected error occurred.",
          sm_born_prefix: "Born",
          sm_view_btn: "View",
          sm_edit_btn: "Edit",
          sm_mother_phone_number: "Mother Phone number",
          sm_father_phone_number: "Father Phone number",
          sm_years_old: "years old",














          tm_title: "Teacher Management",
          tm_desc: "Add and manage teaching staff across all subjects",
          tm_reload_btn: "Refresh",
          tm_add_btn: "Add Teacher",
      
          tm_school_not_configured_alert_title: "School type not configured.",
          tm_school_not_configured_alert_desc_1: "Please ask the headmaster to configure the school type in Settings → School Info",
          tm_school_not_configured_alert_desc_2: "before managing teachers.",
          tm_school_not_configured_card_title: "Teacher Management Unavailable",
          tm_school_not_configured_card_desc: "The school type must be configured by the headmaster before you can add or manage teachers. This ensures teachers are assigned subjects appropriate for your school level.",
      
          tm_loading_text: "Loading Teachers Data...",
      
          tm_school_type_label: "School Type:",
          tm_subjects_available_label: "subjects available",
      
          tm_search_filter_title: "Search & Filter",
          tm_search_placeholder: "Search teachers by name, username, email, or subjects...",
          tm_filter_placeholder: "Filter by status",
          tm_filter_all: "All Status",
          tm_filter_active: "Active",
          tm_filter_inactive: "Inactive",
          tm_filter_on_leave: "On Leave",
      
          tm_teachers_title: "Teachers",
          tm_teachers_desc: "Manage all teaching staff and their subjects",
          tm_no_teachers_title: "No teachers found",
          tm_no_teachers_desc_empty: "Add your first teacher to get started",
          tm_no_teachers_desc_has_teachers: "Try adjusting your search filters",
      
          tm_card_id: "ID:",
          tm_card_joined: "Joined:",
          tm_card_modules_label: "Modules",
          tm_card_more_label: "and ",
          tm_card_more_label1: "more",
          tm_card_view_btn: "View",
          tm_card_edit_btn: "Edit",
          tm_card_delete_btn: "Delete",
      
          tm_dialog_add_title: "Add New Teacher",
          tm_dialog_edit_title: "Edit Teacher",
          tm_dialog_add_desc: "Fill this form to add a new teacher to your school",
          tm_dialog_edit_desc_1: "Update information for",
          tm_dialog_edit_desc_2: "{teacherName}",
      
          tm_form_basic_info: "Basic Information",
          tm_username: "Username",
          tm_full_name: "Full Name",
          tm_phone_number: "Phone Number",
          tm_national_id: "National ID",
          tm_email: "Email",
          tm_password: "Password",
          tm_password_placeholder_new: "Enter password",
          tm_password_placeholder_edit: "Enter new password (optional)",
      
          tm_subjects_selected_label: "Selected Subjects",
          tm_subjects_list_label: "Available Subjects",
          tm_cancel_btn: "Cancel",
          tm_add_teacher_btn: "Add Teacher",
          tm_update_teacher_btn: "Update Teacher",
      
          tm_view_title: "Teacher Details",
          tm_view_desc_part1: "Complete information about",
          tm_view_desc_part2: "{teacherName}",
          tm_view_assigned_subjects: "Assigned Subjects",
          tm_view_basic_info: "Basic Information",
          tm_view_teaching_history: "Teaching History",
          tm_view_history_assigned: "Assigned to",
          tm_view_history_removed: "Removed from",
          tm_view_history_no_data: "No teaching history available.",
          tm_close_btn: "Close",
      
          tm_error_no_token: "No valid session token. Please log in again.",
          tm_error_submit_fail: "Failed to save teacher.",
          tm_desc_prefix: "Add and manage teaching staff for",
          tm_desc_suffix: "level",
          tm_of_total: "of total",
          tm_created_date: "Created Date",















          lp_nav_about: "About",
          lp_nav_features: "Features",
          lp_nav_dev_team: "Dev Team",
          lp_nav_pricing: "Pricing",
          lp_dashboard_btn: "Dashboard",
      
          lp_about_badge: "🎓 Transforming Education in Algeria",
          lp_about_title_part1: "The complete platform for",
          lp_about_title_highlight: "modern school",
          lp_about_title_part2: "management",
          lp_about_desc: "Streamline your educational institution with dashboards for headmasters, teachers, students, and parents.",
          lp_about_get_started: "Get Started",
          lp_about_watch_demo: "Watch Demo",
      
          lp_features_title: "Everything your school needs",
          lp_features_desc: "Comprehensive tools for every member of your school community",
      
          lp_feature_headmaster_title: "Headmaster Dashboard",
          lp_feature_headmaster_desc: "Complete school oversight with analytics, reports, and administrative controls.",
          lp_feature_teacher_title: "Teacher Portal",
          lp_feature_teacher_desc: "Manage classes, grades, attendance, and communicate with students and parents.",
          lp_feature_student_title: "Student Hub",
          lp_feature_student_desc: "Access assignments, grades, schedules, and collaborate with classmates.",
          lp_feature_parent_title: "Parent Access",
          lp_feature_parent_desc: "Monitor your child's progress, attendance, and communicate with teachers.",
          lp_feature_admin_title: "Admin Panel",
          lp_feature_admin_desc: "System administration, user management, and technical configurations.",
          lp_feature_analytics_title: "Analytics & Reports",
          lp_feature_analytics_desc: "Comprehensive insights into academic performance and school operations.",
      
          lp_team_title: "Meet Our Developers",
          lp_team_desc_prefix: "Developed by:",
          lp_team_member_1_name: "Merad Mohamed Said",
          lp_team_member_1_role: "Back End Developer",
          lp_team_member_1_bio: "Full-stack developer with 4+ years in the field",
          lp_team_member_2_name: "Amrane Mohamed Aymen",
          lp_team_member_2_role: "Front End Developer",
          lp_team_member_2_bio: "Web Developer with 3+ years in the field",
      
          lp_pricing_title: "Simple, transparent pricing",
          lp_pricing_desc: "Choose the perfect plan for your school — no hidden fees.",
          lp_pricing_plan_starter: "Starter",
          lp_pricing_plan_professional: "Professional",
          lp_pricing_plan_enterprise: "Enterprise",
          lp_pricing_plan_period: "DZD/student",
          lp_pricing_plan_popular: "Most Popular",
          lp_pricing_plan_get_started: "Get Started",
          lp_pricing_footer_btn: "Get Started",
      
          lp_footer_text_part1: "©",
          lp_footer_text_heart: "❤️",
          lp_footer_text_part2: "Made with love for Algerian education.",







          adminManagementTitle1: "Admin Management",
          adminManagementDesc1: "Manage administrative staff accounts and permissions",
        
          addAdmin1: "Add Admin",
        
          successTitle1: "Success",
        
          adminStaffMembers1: "Admin Staff Members",
          adminStaffMembersDesc1: "Manage all administrative staff members",
        
          actions1: "Actions",
          loadingAdminData1: "Loading admin data...",
          noAdminsFound1: "No admin staff members found",
        
          createNewAdmin1: "Create New Admin",
          editAdmin1: "Edit Admin",
        
          createNewAdminDesc1: "Fill in the form to create a new admin staff member.",
          editAdminDesc1: "Update the details for the selected staff member.",
        
          leaveBlank1 : "Leave blank to keep current password",
        
          createAdmin1: "Create Admin",
          saveChanges1: "Save Changes",
        
          phoneNumber1: "Phone Number",
        
          authenticationFailed1: "Authentication failed.",
          passwordTooShort1: "Password is required and must be at least 8 characters long.",
          passwordTooShortEdit1: "New password must be at least 8 characters long.",
        
          adminCreatedSuccess1: "Admin staff member created successfully!",
          adminUpdatedSuccess1: "Admin staff member updated successfully!",
        
          unknownError1: "An unknown error occurred.",



    

          tabPwdMgmt_title1: "Tab Password Management",
          tabPwdMgmt_description: "Manage security passwords for each administrative section.",
      
          tabPwdMgmt_loading: "Loading Password Settings...",
      
          tabPwdMgmt_statusTitle: "Password Status",
          tabPwdMgmt_statusSuffix: " sections secured",
          tabPwdMgmt_configuredLabel: "Configured",
      
          tabPwdMgmt_tabPedagogy: "Pedagogy",
          tabPwdMgmt_tabFinance: "Finance",
          tabPwdMgmt_tabAttendance: "Attendance",
          tabPwdMgmt_tabAssets: "Assets",
      
          tabPwdMgmt_descPedagogy: "Manage students, teachers, groups, and schedules",
          tabPwdMgmt_descFinance: "Handle payments, salaries, and financial tracking",
          tabPwdMgmt_descAttendance: "Track employee attendance and presence",
          tabPwdMgmt_descAssets: "Manage school equipment and inventory",
      
          tabPwdMgmt_stateSet: "Set",
          tabPwdMgmt_stateNotSet: "Not set",
      
          tabPwdMgmt_btnSetPassword: "Set Password",
          tabPwdMgmt_btnUpdatePassword: "Update Password",
          tabPwdMgmt_btnCancel: "Cancel",
          tabPwdMgmt_btnSave: "Save",
      
          tabPwdMgmt_dialogSetTitle: "Set Password for",
          tabPwdMgmt_dialogUpdateTitle: "Update Password for",
          tabPwdMgmt_dialogCreateDesc: "Create a secure password for this admin section.",
          tabPwdMgmt_dialogUpdateDesc: "Update the existing password for this admin section.",
      
          tabPwdMgmt_labelNewPassword: "New Password",
          tabPwdMgmt_labelConfirmPassword: "Confirm Password",
          tabPwdMgmt_placeholderPassword: "Enter password",
          tabPwdMgmt_placeholderConfirmPassword: "Confirm password",
      
          tabPwdMgmt_errorEmpty: "Password cannot be empty",
          tabPwdMgmt_errorTooShort: "Password must be at least 4 characters long",
          tabPwdMgmt_errorMismatch: "Passwords do not match",
          tabPwdMgmt_errorFetchStatus: "Could not load password statuses from the server.",
      
          tabPwdMgmt_successUpdate: "Password updated successfully!",
      
          tabPwdMgmt_importantLabel: "Important:",
          tabPwdMgmt_importantNotice:
            "Passwords protect sensitive administrative sections. Share them only with authorized staff.",






            assetAdd_btnAddAsset: "Add Asset",
    assetAdd_btnAdd: "Add Asset",
    assetAdd_btnAddPlural: "Assets",

    assetAdd_phName: "e.g., Desktop PC, Student Chair",
    assetAdd_phSerial: "e.g., SN00123AD",
    assetAdd_phPurchasePrice: "15000.00",
    assetAdd_phDescription: "e.g., i5 model, 8GB RAM, 256GB SSD",
    assetAdd_phSelectCategory: "Select category",
    assetAdd_phSelectLocation: "Select location",

    assetAdd_toastSuccessPrefix: "Successfully added",
    assetAdd_toastSuccessSingular: "asset",
    assetAdd_toastSuccessPlural: "assets",
    assetAdd_toastErrorFallback: "Failed to add asset. Please try again.",
    assetAdd_errorAuth: "Authentication Failed.",

    assetAdd_multiExamplePrefix: "Multiple assets detected:",
    assetAdd_multiExampleSuffix:
      "items will be created with incremental numbering",

    assetAdd_totalCostSuffix: "DZD",

    assetCatFurniture: "School Furniture (Desks, Chairs, Boards)",
    assetCatIT: "IT Equipment (Computers, Printers, Projectors)",
    assetCatLab: "Laboratory Equipment (Microscopes, Glassware)",
    assetCatSport: "Sports Equipment (Balls, Nets, Mats)",
    assetCatAV: "Audiovisual (TVs, Cameras, Speakers)",
    assetCatMusic: "Musical Instruments",
    assetCatBooks: "Books and School Manuals",
    assetCatCanteen: "Canteen / Kitchen Equipment",
    assetCatMaintenance: "Maintenance Tools",
    assetCatVehicles: "Service Vehicles",
    assetCatSecurity: "Safety Equipment (Extinguishers, First Aid Kits)",
    assetCatOther: "Other",

    assetLocMainOffice: "Main Office",
    assetLocTeachersRoom: "Teachers Room",
    assetLocComputerRoom: "Computer Room",
    assetLocLibrary: "Library",
    assetLocGym: "Gym",
    assetLocScienceLab: "Science Laboratory",
    assetLocArtRoom: "Art Room",
    assetLocMusicRoom: "Music Room",
    assetLocCanteen: "Canteen",
    assetLocStorage: "Storage Room",
    assetLocMaintenance: "Maintenance Room",
    assetLocClass101: "Classroom 101",
    assetLocClass102: "Classroom 102",
    assetLocClass201: "Classroom 201",
    assetLocOutdoor: "Outdoor / Yard",



  },

  ar: {
    editAdminDesc2: "قم بتحديث التفاصيل للموظف المحدد.",
    // Navigation & Common
    no_active_subscription_title: "الاشتراك غير نشط",
    no_active_subscription_desc: "مدرستك ليس لديها اشتراك نشط. يرجى الاتصال بالمسؤول.",
    no_active_subscription_logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    welcome: "مرحباً",
    loading: "جاري التحميل...",
    gettingReady: "جاري التحضير...",

    // Login Page
    welcomeTo: "مرحباً بك في",
    directis360: "ديريكتيس 360",
    streamlinedDashboards:
      "لوحات تحكم مبسطة لمديري المدارس والمعلمين والطلاب وأولياء الأمور — كل ذلك في منصة آمنة واحدة.",
    signIn: "تسجيل الدخول",
    accessDashboard: "الوصول إلى لوحة التحكم الأكاديمية",
    identificator: "المعرف",
    enterIdentificator: "أدخل معرفك",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    signingIn: "جاري تسجيل الدخول...",
    headmasterUpgrade: "هل أنت مدير مدرسة وتريد ترقية مدرستك؟",
    joinUs: "انضم إلينا",

    // Role Selection
    selectRole: "اختر دورك للوصول إلى لوحة التحكم",
    accessDashboard2: "الوصول إلى لوحة التحكم",
    needHelp: "تحتاج مساعدة؟ اتصل بمسؤول النظام أو",
    contactAdmin: "اتصل بالمسؤول",
    viewDocumentation: "عرض الوثائق",

    // Roles
    bossHeadmaster: "المدير / مدير المدرسة",
    bossHeadmasterDesc: "إدارة المدرسة الكاملة والإدارة",
    staffAdmin: "الموظفين / الإدارة",
    staffAdminDesc: "الأدوار الإدارية والإدارة",
    teacher: "المعلم",
    teacherDesc: "التدريس وإدارة الطلاب",
    student: "الطالب",
    studentDesc: "بوابة الطالب والمعلومات",
    parent: "ولي الأمر",
    parentDesc: "بوابة ولي الأمر ومراقبة الطفل",

    // Features
    createAdminAccounts: "إنشاء حسابات المسؤولين",
    setTabPasswords: "تعيين كلمات مرور التبويبات",
    viewAnalytics: "عرض التحليلات",
    manageSchoolSettings: "إدارة إعدادات المدرسة",
    pedagogyManagement: "إدارة التربية",
    financeTracking: "تتبع المالية",
    attendanceMonitoring: "مراقبة الحضور",
    assetsManagement: "إدارة الأصول",
    manageStudentGroups: "إدارة مجموعات الطلاب",
    enterGrades: "إدخال الدرجات",
    markAttendance: "تسجيل الحضور",
    viewSchedule: "عرض الجدول",
    viewGrades: "عرض الدرجات",
    checkSchedule: "فحص الجدول",
    groupInformation: "معلومات المجموعة",
    communityAccess: "الوصول إلى المجتمع",
    childProgress: "تقدم الطفل",
    paymentTracking: "تتبع المدفوعات",
    busTracking: "تتبع الحافلة",
    receiveAlerts: "استقبال التنبيهات",

    // Header
    welcomeBack: "مرحباً بعودتك!",
    thisIsYourDashboard: "هذه لوحة التحكم الخاصة بك.",
    refreshingData: "جاري تحديث البيانات...",
    signedInAs: "مسجل الدخول كـ",

    // Sidebar
    managementSystem: "نظام الإدارة",

    // Admin Management Page
adminManagementTitle: "إدارة موظفي الإدارة",
adminManagementDesc: "إنشاء وإدارة حسابات موظفي الإدارة",
addAdmin: "إضافة مسؤول",
adminStaffMembers: "موظفو الإدارة",
adminStaffMembersDesc: "قائمة بجميع الموظفين ذوي صلاحيات الإدارة.",
fullName: "الاسم الكامل",
username: "اسم المستخدم",
email: "البريد الإلكتروني",
phone: "الهاتف",
createdAt: "تاريخ الإنشاء",
actions: "الإجراءات",
loadingAdminData: "جاري تحميل بيانات المسؤولين...",
noAdminsFound: "لم يتم العثور على موظفي إدارة.",
successTitle: "تم بنجاح",
createNewAdmin: "إنشاء مسؤول جديد",
editAdmin: "تعديل المسؤول",
createNewAdminDesc: "املأ التفاصيل لإنشاء حساب موظف جديد.",
editAdminDesc: "قم بتحديث التفاصيل للموظف المحدد.",
leaveBlank: "اتركه فارغًا للاحتفاظ بالحالي",
phoneNumber: "رقم الهاتف",
cancel: "إلغاء",
createAdmin: "إنشاء مسؤول",
saveChanges: "حفظ التغييرات",
adminCreated: "تم إنشاء حساب الموظف الإداري بنجاح!",
adminUpdated: "تم تحديث حساب الموظف الإداري بنجاح!",
passwordTooShort: "كلمة المرور مطلوبة ويجب أن تتكون من 8 أحرف على الأقل.",
newPasswordTooShort: "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.",
authFailed: "فشل في المصادقة.",
unknownError: "حدث خطأ غير معروف.",

   // Tab Password Manager Page
tabPasswordManagementTitle: "إدارة كلمات مرور الأقسام",
tabPasswordManagementDesc: "قم بتعيين وإدارة كلمات المرور لأقسام الإدارة المختلفة",
success: "تم بنجاح",
passwordUpdated: "تم تحديث كلمة المرور بنجاح!",
loadingPasswordSettings: "جاري تحميل إعدادات كلمة المرور...",
passwordStatus: "حالة كلمة المرور",
passwordStatusCount: " أدوار الإدارة لديها كلمات مرور معينة",
configured: "تم التكوين",

// Tabs
tabPedagogy: "التربية",
tabPedagogyDesc: "إدارة الطلاب والمعلمين والمجموعات والجداول",
tabFinance: "المالية",
tabFinanceDesc: "إدارة المدفوعات والرواتب والتتبع المالي",
tabAttendance: "الحضور",
tabAttendanceDesc: "تتبع حضور الموظفين والطلاب",
tabAssets: "الأصول",
tabAssetsDesc: "إدارة معدات المدرسة والمخزون",

// Status
set: "مُعين",
notSet: "غير مُعين",

// Buttons
updatePassword: "تحديث كلمة المرور",
setPassword: "تعيين كلمة المرور",

// Important
importantLabel: "هام:",
importantNotice: "ستكون هذه الكلمات مطلوبة للموظفين للوصول إلى أقسامهم. شاركها بشكل آمن.",

// Dialog
setPasswordFor: "تعيين كلمة مرور لـ {name}",
updatePasswordFor: "تحديث كلمة مرور لـ {name}",
createPasswordDesc: "قم بإنشاء كلمة مرور آمنة لهذا القسم الإداري.",
updatePasswordDesc: "قم بتحديث كلمة المرور لهذا القسم الإداري.",
newPassword: "كلمة المرور الجديدة",
confirmPassword: "تأكيد كلمة المرور",
enterPasswordPlaceholder: "أدخل كلمة المرور (6 أحرف على الأقل)",
confirmPasswordPlaceholder: "تأكيد كلمة المرور الجديدة",

// Errors
passwordCannotBeEmpty: "لا يمكن أن تكون كلمة المرور فارغة",
passwordTooShort4: "يجب أن تتكون كلمة المرور من 4 أحرف على الأقل",
passwordsNotMatch: "كلمتا المرور غير متطابقتين",
authTokenNotFound: "رمز المصادقة غير موجود.",
couldNotLoadStatuses: "تعذر تحميل حالات كلمات المرور من الخادم.",


// Analytics Dashboard Page
financialSummary: "الملخص المالي",
financialSummaryDesc: "ملخص النشاط المالي على مدار الوقت.",
totalIncome: "إجمالي الإيرادات",
totalExpenses: "إجمالي المصروفات",
netProfit: "صافي الربح",
goToFinanceDashboard: "انتقل إلى لوحة التحكم المالية للحصول على التفاصيل الكاملة",

academicPerformanceTitle: "الأداء الأكاديمي حسب المجموعة",
academicPerformanceDesc: "متوسط الدرجات وعدد الطلاب لكل مجموعة أكاديمية.",
level: "المستوى",
speciality: "التخصص",
studentCount: "عدد الطلاب",
averageGrade: "المعدل",
gradeOutOf: "/ 20",

schoolVitals: "مؤشرات المدرسة",
activeGroups: "المجموعات النشطة",
unassignedStudents: "الطلاب غير المخصصين",

attendanceLast30Days: "الحضور (آخر 30 يومًا)",
workerAttendance: "حضور الموظفين",
studentAbsenceHotspots: "مناطق غياب الطلاب",
absences: "غياب",

topTeachers: "أفضل المعلمين",
topTeachersDesc: "حسب عدد المجموعات المسندة",
groups: "المجموعات",


// Add Asset Page
addAsset: "إضافة أصل",
addNewAssets: "إضافة أصول جديدة",
addAssetsDesc: "املأ التفاصيل أدناه لإضافة أصول إلى مخزون المدرسة.",
adding: "جاري الإضافة...",
addAssetSingle: "إضافة أصل",
addAssetMultiple: "إضافة {quantity} أصل",

essentialInfo: "المعلومات الأساسية",
essentialInfoDesc: "التفاصيل المطلوبة لكل أصل",
assetName: "اسم الأصل *",
assetNamePlaceholder: "مثال: حاسوب مكتبي، كرسي طالب",
category: "الفئة *",
selectCategory: "اختر الفئة",
location: "الموقع *",
selectLocation: "اختر الموقع",
quantity: "الكمية *",
ownership: "الملكية *",
ownershipSchool: "مملوك للمدرسة",
ownershipLeased: "مستأجر",
ownershipDonated: "متبرع به",
ownershipBorrowed: "مُعار",

multipleAssetsLabel: "أصول متعددة:",
multipleAssetsDesc: "سيتم إنشاء {quantity} عنصرًا بأسماء متسلسلة (مثال: {name} #1).",

optionalDetails: "تفاصيل إضافية",
optionalDetailsDesc: "معلومات إضافية لتتبع أفضل",
serialNumber: "الرقم التسلسلي",
serialNumberPlaceholder: "مثال: SN00123AD",
purchaseDate: "تاريخ الشراء",
purchasePrice: "سعر الشراء (لكل وحدة) (دج)",
totalCost: "التكلفة الإجمالية: {amount} دج",
description: "الوصف / الملاحظات",
descriptionPlaceholder: "مثال: موديل i5، ذاكرة 8GB، قرص 256GB SSD",

toastSuccess: "تمت إضافة {quantity} أصل بنجاح!",
failedAddAsset: "فشل في إضافة الأصل. حاول مرة أخرى.",

assetCategories: "فئات الأصول",
assetCategoriesDesc: "تصفح الأصول منظمة حسب الفئة من الألف إلى الياء",
searchCategoriesAssets: "ابحث عن الفئات أو الأصول...",

items: "عناصر",
totalValue: "القيمة الإجمالية:",
activeLabel: "نشط:",
schoolOwnedLabel: "مملوك للمدرسة:",
recentItems: "العناصر الأخيرة:",
moreItems: " عناصر أخرى",

noCategories: "لم يتم العثور على فئات",
noAssetsYet: "لم تتم إضافة أي أصول بعد",
tryAdjustSearch: "جرّب تعديل معايير البحث",

categoryAssets: "أصول {category}",
categorySummary: " عنصر • القيمة الإجمالية:  دج",

summaryActive: "نشط",
summaryGoodCondition: "حالة جيدة",
summaryNeedAttention: "تحتاج إلى صيانة",
summarySchoolOwned: "مملوك للمدرسة",

value: "القيمة:",
assignedTo: "مخصص لـ:",
serial: "الرقم التسلسلي:",

conditionExcellent: "ممتاز",
conditionGood: "جيد",
conditionFair: "مقبول",
conditionPoor: "ضعيف",
conditionNeedsRepair: "يحتاج إلى إصلاح",

statusActive: "نشط",
statusInactive: "غير نشط",
statusMaintenance: "صيانة",
statusDisposed: "تم التخلص منه",


totalAssets: "إجمالي الأصول",
activeAssets: " أصول نشطة",
depreciation: "الاستهلاك: ",
maintenanceAlerts: "تنبيهات الصيانة",
overdueTasks: "مهام متأخرة",

assetConditionDistribution: "توزيع حالة الأصول",

recentActivities: "الأنشطة الأخيرة",
maintenanceCompleted: "تمت الصيانة لـ ",
newAssetAdded: "تمت إضافة أصل جديد: ",
completed: "مكتمل",
added: "مضاف",
noRecentActivities: "لا توجد أنشطة حديثة",



    // ===== صفحة إعدادات الأصول =====
    settingsSaved: "تم حفظ الإعدادات بنجاح!",

    generalSettings: "الإعدادات العامة",
    generalSettingsDesc: "تكوين تفضيلات إدارة الأصول العامة",
    defaultDepRate: "معدل الإهلاك الافتراضي (%)",
    annualDepRateHint: "معدل الإهلاك السنوي للأصول الجديدة",
    maintenanceReminder: "تذكير الصيانة (أيام)",
    maintenanceReminderHint: "عدد الأيام قبل الصيانة لعرض التنبيهات",
    lowValueThreshold: "حد القيمة المنخفضة ($)",
    lowValueThresholdHint: "الأصول التي تقل قيمتها عن هذا الحد تعتبر منخفضة القيمة",
    defaultMaintenanceInterval: "الفاصل الزمني الافتراضي للصيانة (أشهر)",
    defaultMaintenanceIntervalHint: "المدة الافتراضية بين جداول الصيانة",

    autoUpdateValues: "تحديث تلقائي لقيم الأصول",
    autoUpdateValuesDesc: "حساب القيم المتهالكة تلقائيًا",
    maintenanceAlertsDesc: "عرض إشعارات للصيانة القادمة",
    lowValueTracking: "تتبع الأصول منخفضة القيمة",
    lowValueTrackingDesc: "تضمين الأصول تحت الحد في التتبع",
    barcodeScanning: "تمكين المسح بالباركود",
    barcodeScanningDesc: "استخدام الباركود/رموز QR لتحديد الأصول",
    assetTransfers: "تمكين نقل الأصول",
    assetTransfersDesc: "السماح بنقل الأصول بين المواقع",
    disposalApproval: "يتطلب موافقة للتخلص",
    disposalApprovalDesc: "يجب الموافقة على الأصول قبل التخلص منها",
    saveSettings: "حفظ الإعدادات",


    addCategory: "إضافة فئة",
    active: "نشط",
    inactive: "غير نشط",
    depRate: "معدل الإهلاك:",
    annually: "سنوياً",
    maintenanceInterval: "الفاصل الزمني للصيانة:",
    months: "أشهر",
    deactivate: "تعطيل",
    activate: "تفعيل",
    addCategoriesHint: "أضف فئات لتنظيم أصولك",

    dataManagement: "إدارة البيانات",
    dataManagementDesc: "استيراد، تصدير، ونسخ احتياطي لبيانات الأصول",
    exportData: "تصدير البيانات",
    importData: "استيراد البيانات",
    dataNotice: "ملاحظة إدارة البيانات",
    dataNoticeDesc:
      "سيؤدي استيراد البيانات إلى استبدال السجلات الحالية. تأكد من تصدير بياناتك الحالية كنسخة احتياطية قبل الاستيراد.",

    addAssetCategory: "إضافة فئة أصول",
    addAssetCategoryDesc: "إنشاء فئة جديدة لتنظيم الأصول",
    categoryName: "اسم الفئة *",
    categoryDescription: "الوصف",
    depRatePercent: "معدل الإهلاك (%)",
    maintenanceIntervalMonths: "الفاصل الزمني للصيانة (أشهر)",
    placeholderCategoryName: "مثال: معدات رياضية",
    placeholderCategoryDesc: "وصف موجز لهذه الفئة...",

    editAssetCategory: "تعديل فئة الأصول",
    editAssetCategoryDesc: "تحديث معلومات الفئة",

    alertEnterCategoryName: "يرجى إدخال اسم الفئة",
    alertDeleteCategoryConfirm:
      "هل أنت متأكد أنك تريد حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.",
    alertImportSuccess: "تم استيراد البيانات بنجاح!",
    alertImportError: "خطأ في استيراد البيانات. يرجى التحقق من تنسيق الملف.",

    maintenanceAlerts1: "تمكين تنبيهات الصيانة",
    maintenanceAlertsDesc1: "عرض التنبيهات للصيانة القادمة",
    assetCategoriesDesc1: "إدارة فئات الأصول وإعداداتها الافتراضية",
    noCategories1: "لم يتم تكوين أي فئات",



    inventory_title: "جرد الأصول",
    inventory_description: "إدارة وتصنيف وتتبع أصول المدرسة.",
    refresh: "تحديث",
    add_asset: "إضافة أصل",
    search_assets: "ابحث في الأصول...",
    all_categories: "جميع الفئات",
    all_conditions: "جميع الحالات",
    all_statuses: "جميع الحالات",
    no_assets_found: "لم يتم العثور على أصول.",
    try_adjusting_filters: "حاول تعديل عوامل التصفية.",
    view: "عرض",
    edit: "تعديل",
    delete: "حذف",
    confirm_delete_asset: "هل أنت متأكد أنك تريد حذف هذا الأصل؟",
    asset_details_category: "الفئة",
    asset_details_location: "الموقع",
    asset_details_serial: "الرقم التسلسلي",
    asset_details_purchase_date: "تاريخ الشراء",
    asset_details_purchase_price: "سعر الشراء",
    asset_details_ownership: "الملكية",
    add_new_asset: "إضافة أصل جديد",
    edit_asset: "تعديل الأصل",
    asset_name: "الاسم",
    asset_category: "الفئة",
    asset_location: "الموقع",
    asset_serial_number: "الرقم التسلسلي",
    asset_purchase_date: "تاريخ الشراء",
    asset_purchase_price: "سعر الشراء",
    asset_condition: "الحالة",
    asset_status: "الحالة",
    asset_ownership: "الملكية",
    ownership_school_owned: "مملوك للمدرسة",
    ownership_leased: "مستأجر",
    ownership_donated: "متبرع به",
    ownership_borrowed: "مستعار",
    condition_excellent: "ممتاز",
    condition_good: "جيد",
    condition_fair: "مقبول",
    condition_poor: "ضعيف",
    condition_needs_repair: "بحاجة إلى إصلاح",
    status_active: "نشط",
    status_inactive: "غير نشط",
    status_maintenance: "صيانة",
    status_disposed: "تم التخلص منه",
    save: "حفظ",


    maint_title: "تتبع الصيانة",
    maint_desc: "قم بجدولة وتتبع وإدارة جميع مهام صيانة الأصول.",
    maint_new_btn: "صيانة جديدة",
    maint_filters_status: "تصفية حسب الحالة",
    maint_filters_type: "تصفية حسب النوع",
    maint_filters_priority: "تصفية حسب الأولوية",
    maint_no_records: "لم يتم العثور على سجلات صيانة.",

    maint_status_all: "جميع الحالات",
    maint_status_scheduled: "مجدولة",
    maint_status_inprogress: "قيد التنفيذ",
    maint_status_completed: "مكتملة",
    maint_status_overdue: "متأخرة",

    maint_type_all: "جميع الأنواع",
    maint_type_routine: "روتينية",
    maint_type_repair: "إصلاح",
    maint_type_inspection: "فحص",

    maint_priority_all: "جميع الأولويات",
    maint_priority_low: "منخفضة",
    maint_priority_medium: "متوسطة",
    maint_priority_high: "مرتفعة",
    maint_priority_urgent: "عاجلة",

    maint_schedule_title: "جدولة الصيانة",
    maint_edit_title: "تعديل الصيانة",
    maint_asset_label: "الأصل",
    maint_asset_placeholder: "اختر الأصل...",
    maint_date_label: "تاريخ الجدولة",
    maint_type_label: "النوع",
    maint_type_placeholder: "اختر النوع",
    maint_priority_label: "الأولوية",
    maint_priority_placeholder: "اختر الأولوية",
    maint_description_label: "الوصف",
    maint_description_placeholder: "صف مهمة الصيانة...",

    maint_btn_cancel: "إلغاء",
    maint_btn_save: "حفظ",
    maint_btn_edit: "تعديل",
    maint_btn_delete: "حذف",


    search_assets_title: "البحث عن الأصول",
    search_assets_desc: "ابحث وصنف الأصول باستخدام معايير متقدمة",
    search_assets_placeholder: "ابحث بالاسم، الفئة، الموقع، الرقم التسلسلي، الشركة المصنعة، الطراز أو الملاحظات...",
    search_assets_filters_btn: "التصفية",
    search_assets_export_btn: "تصدير",

    search_assets_adv_filters: "التصفية المتقدمة",
    search_assets_clear_all: "مسح الكل",

    search_assets_category_label: "الفئة",
    search_assets_condition_label: "الحالة",
    search_assets_status_label: "الحالة",
    search_assets_location_label: "الموقع",
    search_assets_price_label: "نطاق السعر",
    search_assets_date_label: "تاريخ الشراء",
    search_assets_assigned_label: "مخصص لـ",

    search_assets_category_all: "جميع الفئات",
    search_assets_condition_all: "جميع الحالات",
    search_assets_status_all: "جميع الحالات",
    search_assets_location_all: "جميع المواقع",
    search_assets_price_all: "جميع الأسعار",
    search_assets_date_all: "جميع التواريخ",

    search_assets_condition_excellent: "ممتاز",
    search_assets_condition_good: "جيد",
    search_assets_condition_fair: "متوسط",
    search_assets_condition_poor: "ضعيف",
    search_assets_condition_needsrepair: "بحاجة إلى إصلاح",

    search_assets_status_active: "نشط",
    search_assets_status_inactive: "غير نشط",
    search_assets_status_maintenance: "قيد الصيانة",
    search_assets_status_disposed: "تم التخلص منه",

    search_assets_price_under100: "أقل من 100 دولار",
    search_assets_price_100_500: "100 - 500 دولار",
    search_assets_price_500_1000: "500 - 1,000 دولار",
    search_assets_price_1000_5000: "1,000 - 5,000 دولار",
    search_assets_price_over5000: "أكثر من 5,000 دولار",

    search_assets_date_lastmonth: "الشهر الماضي",
    search_assets_date_last3months: "آخر 3 أشهر",
    search_assets_date_last6months: "آخر 6 أشهر",
    search_assets_date_lastyear: "السنة الماضية",
    search_assets_date_overyear: "أكثر من سنة",

    search_assets_results_found: "تم العثور على ",
    search_assets_results_found_asset: "أصل",
    search_assets_results_value: "القيمة الإجمالية:",

    search_assets_no_results_title: "لم يتم العثور على أصول",
    search_assets_no_results_empty: "لم تتم إضافة أي أصول إلى المخزون بعد",
    search_assets_no_results_try: "حاول تعديل معايير البحث أو الفلاتر",
    search_assets_clear_btn: "مسح البحث والفلاتر",

    search_assets_details_title: "تفاصيل الأصل",
    search_assets_details_desc: "معلومات كاملة حول هذا الأصل",

    search_assets_details_name: "اسم الأصل",
    search_assets_details_category: "الفئة",
    search_assets_details_condition: "الحالة",
    search_assets_details_status: "الحالة",
    search_assets_details_location: "الموقع",
    search_assets_details_assigned: "مخصص لـ",
    search_assets_details_purchase_date: "تاريخ الشراء",
    search_assets_details_purchase_price: "سعر الشراء",
    search_assets_details_current_value: "القيمة الحالية",
    search_assets_details_serial: "الرقم التسلسلي",
    search_assets_details_manufacturer: "الشركة المصنعة",
    search_assets_details_model: "الطراز",
    search_assets_details_warranty: "الضمان",
    search_assets_details_last_maintenance: "آخر صيانة",
    search_assets_details_next_maintenance: "الصيانة القادمة",
    search_assets_details_notes: "ملاحظات",
    search_assets_details_purchased: "شراء:",




    attendance_overview_title: "نظرة عامة على الحضور",
    attendance_overview_desc: "عرض إحصائيات الحضور ليوم محدد.",

    attendance_select_date: "اختر التاريخ",
    attendance_department_label: "القسم",
    attendance_all_departments: "جميع الأقسام",
    attendance_export_btn: "تصدير",
    attendance_exporting_btn: "جاري التصدير...",

    attendance_loading: "جاري تحميل الإحصائيات...",

    attendance_daily_stats: "الإحصائيات اليومية",
    attendance_stat_total: "الإجمالي",
    attendance_stat_present: "حاضر",
    attendance_stat_absent: "غائب",
    attendance_stat_late: "متأخر",
    attendance_stat_justified: "مُبرر",
    attendance_stat_holiday_rest: "عطلة/راحة",
    attendance_stat_unmarked: "غير مُحدد",

    attendance_department_breakdown: "تفصيل الأقسام",
    attendance_department_rate: "النسبة",
    attendance_no_department_data: "لا توجد بيانات عن الأقسام",

    attendance_records_day: "سجلات اليوم",
    attendance_no_records: "لا توجد سجلات",
    attendance_unmarked_member: "عضو غير مسمى",

    attendance_status_present: "حاضر",
    attendance_status_absent: "غائب",
    attendance_status_late: "متأخر",
    attendance_status_justified: "غياب مبرر",
    attendance_status_holiday: "عطلة",
    attendance_status_rest: "يوم راحة",
    attendance_status_unknown: "غير معروف",

    attendance_pdf_title: "تقرير الحضور",
    attendance_pdf_date: "التاريخ",
    attendance_pdf_department: "القسم",
    attendance_pdf_generated: "تم إنشاؤه في",
    attendance_pdf_headers_name: "الاسم",
    attendance_pdf_headers_department: "القسم",
    attendance_pdf_headers_role: "الدور",
    attendance_pdf_headers_status: "الحالة",
    attendance_pdf_headers_time: "الوقت",
    attendance_pdf_headers_remarks: "ملاحظات",
    attendance_pdf_no_data: "لا توجد بيانات لتصديرها.",



    tracking_daily_progress_title: "التقدم اليومي",
    tracking_daily_progress_desc: "ملخص لأعضاء الطاقم المصفّين حالياً.",

    tracking_total_staff: "إجمالي الطاقم",
    tracking_marked: "تم التحديد",
    tracking_unmarked: "غير محدد",
    tracking_completion: "الإنجاز",

    tracking_attendance_title: "تتبع الحضور",
    tracking_attendance_desc: "اختر تاريخًا لتسجيل أو تعديل سجلات الحضور.",
    tracking_select_date: "اختر التاريخ",
    tracking_search_staff: "بحث عن الموظفين",
    tracking_search_placeholder: "ابحث بالاسم...",
    tracking_department: "القسم",
    tracking_all_departments: "جميع الأقسام",
    tracking_filter_placeholder: "تصفية...",

    tracking_save_btn: "حفظ التغييرات",
    tracking_saving_btn: "جاري الحفظ...",

    tracking_staff_list: "قائمة الموظفين",
    tracking_loading_records: "جاري تحميل السجلات لـ ",

    tracking_status_label: "الحالة",
    tracking_showing_time: "وقت العرض:",

    tracking_no_staff_found: "لم يتم العثور على موظفين",
    tracking_no_staff_filter: "لا يوجد موظفون يطابقون معايير التصفية الحالية.",

    tracking_status_present: "حاضر",
    tracking_status_absent: "غائب",
    tracking_status_late: "متأخر",
    tracking_status_justified: "مبرر",
    tracking_status_holiday: "عطلة",
    tracking_status_rest: "يوم راحة",
    tracking_status_not_marked: "غير محدد",
    tracking_status_unknown: "غير معروف",

    tracking_auth_missing: "رمز المصادقة غير موجود.",
    tracking_fetch_error: "تعذر تحميل الحضور لهذا التاريخ.",
    tracking_save_success: "تم حفظ الحضور بنجاح!",
    tracking_save_error: "فشل حفظ التغييرات. حاول مرة أخرى.",

    back_to_staff_roles: "العودة إلى دورات الموظفين",
    retry: "إعادة تحميل",
    error: "خطأ",
    loading_asset_data: "جاري تحميل بيانات الأصول...",
    loading_staff_members: "جاري تحميل بيانات الموظفين...",
    loading_finance_data: "جاري تحميل بيانات المالية...",

    loading_overview: "جاري تحميل المعايير...",
    error_loading_dashboard: "خطأ في تحميل المعايير:",
    coming_soon: "قريباً",
    this_section_is_under_construction: "هذا القسم في الإنشاء.",

    parent_account: "حساب الولي",
    children: "الأطفال",
    active_account: "حساب مفعل",
    children_overview: "معاينة الأطفال",
    quick_overview_of_your_children_academic_performance: "معاينة مختصرة لأداء الأطفال الأكاديمي",
    overall_grade: "العلامة العامة",
    absences_lates: "الغيابات / المتأخرات",
    view_full_details: "عرض التفاصيل الكاملة",
    overall_average: "العلامة العامة",
    lates: "المتأخرات",
    teachers: "المدرسين",
    full_report_for: "التقرير الكامل ل",
    academic_marks: "العلامات الأكاديمية",
    trimester: "الفصل",
    coefficient: "المعامل",
    dev1: "التقرير الأول",
    dev2: "التقرير الثاني",
    exam: "الامتحان",
    weekly_schedule: "الجدول الأسبوعي",
    attendance_details: "تفاصيل الحضور",
    no_absences_or_lates_recorded: "لا توجد غيابات أو متأخرات مسجلة.",



    request_a_meeting: "طلب موعد",
    select_teacher: "اختر المدرس",
    academic_performance: "الأداء الأكاديمي",
    behavioral_issues: "المشكلات السلوكية",
    attendance_issues: "الغيابات / المتأخرات",
    health_and_wellbeing: "الصحة والعافية",
    administrative_request: "طلب موعد",
    extracurricular_activities: "الأنشطة الإضافية",
    general_follow_up: "المتابعة العامة",
    conflict_resolution: "حل النزاعات",
    date: "التاريخ",
    notes: "الملاحظات",
    send_request: "إرسال الطلب",
    your_meetings: "مواعيدك",
    cause: "السبب",
    requested: "المطلوب",
    scheduled: "المجدد",
    confirm_new_date: "تأكيد التاريخ الجديد",
    decline_reschedule: "رفض التأجيل",
    no_meetings_found: "لا توجد مواعيد مسجلة.",
    optional: "اختياري",
    refreshing_data: "جاري تحميل البيانات",




    staff_dashboard_title: "لوحة تحكم الموظفين",
    staff_dashboard_loading: "جاري تحميل لوحة التحكم...",

    staff_overview_title: "نظرة عامة على الموظف",
    staff_overview_desc: "مرحبًا بك في لوحة تحكم الموظفين",
    staff_overview_fullname: "الاسم الكامل",
    staff_overview_role: "الوظيفة",
    staff_overview_phone: "الهاتف",
    staff_overview_school: "المدرسة",

    staff_active_tab_title: "الوصول إلى التبويب النشط",
    staff_active_tab_desc: "يمكن فتح تبويب محمي واحد فقط في نفس الوقت.",
    staff_active_tab_unlocked: " مفتوح حاليًا.",
    staff_active_tab_none: "لا توجد تبويبات مفتوحة حاليًا.",
    staff_active_tab_hint: "انقر على تبويب محمي وأدخل كلمة المرور للوصول.",
    staff_active_tab_go: "الانتقال إلى لوحة التحكم",
    staff_active_tab_revoke: "إلغاء الوصول",

    staff_tab_access_granted_title: "تم منح صلاحية الوصول إلى ",
    staff_tab_access_granted_desc: "يمكنك الآن الانتقال إلى .",
    section:"قسم",
    staff_tab_access_btn_go: "اذهب إلى",
    staff_tab_access_btn_revoke: "إلغاء الوصول",

    staff_tab_locked_message: "هذا القسم يتطلب كلمة مرور لفتحه.",
    staff_tab_password_placeholder: "أدخل كلمة المرور",
    staff_tab_password_error: "كلمة المرور غير صحيحة.",
    staff_tab_password_failed: "فشل التحقق من كلمة المرور",
    staff_tab_btn_unlock: "فتح",
    staff_tab_btn_verifying: "جاري التحقق...",
    staff_tab_manage_tasks: "إدارة",
    staff_tab_related_tasks: "المهام المرتبطة",



    staffrole_back_btn: "الرجوع إلى اختيار الدور",
    staffrole_header_title: "إدارة الموظفين",
    staffrole_header_subtitle: "اختر دورك الإداري للمتابعة",

    staffrole_password_status_title: "حالة حماية كلمة المرور",
    staffrole_password_status_count_prefix: "من",
    staffrole_password_status_count_suffix: " من الأدوار لديها كلمات مرور مهيأة",
    staffrole_password_status_missing: "اتصل بالمدير لإعداد كلمات المرور المفقودة",

    staffrole_pedagogy_desc: "إدارة الطلاب والمعلمين",
    staffrole_pedagogy_feature1: "إنشاء حسابات الطلاب",
    staffrole_pedagogy_feature2: "إنشاء الجداول والمجموعات",
    staffrole_pedagogy_feature3: "إنشاء حسابات المعلمين",
    staffrole_pedagogy_feature4: "ربط حسابات أولياء الأمور",

    staffrole_finance_desc: "تتبع وإدارة الأمور المالية",
    staffrole_finance_feature1: "تتبع مالية الموظفين",
    staffrole_finance_feature2: "دخل ومصروفات المدرسة",
    staffrole_finance_feature3: "إضافة موظفين لقاعدة البيانات",
    staffrole_finance_feature4: "تتبع مدفوعات الطلاب",

    staffrole_attendance_desc: "مراقبة حضور الموظفين",
    staffrole_attendance_feature1: "تتبع حضور الموظفين",
    staffrole_attendance_feature2: "تحديد الحضور يدوياً",
    staffrole_attendance_feature3: "تقارير الحضور",
    staffrole_attendance_feature4: "إدارة الغياب",

    staffrole_assets_desc: "معدات المدرسة والمخزون",
    staffrole_assets_feature1: "جرد المعدات",
    staffrole_assets_feature2: "تتبع الأصول",
    staffrole_assets_feature3: "سجلات الصيانة",
    staffrole_assets_feature4: "إدارة المشتريات",

    staffrole_protected: "محمي",
    staffrole_no_password: "بدون كلمة مرور",

    staffrole_btn_access_prefix: "الوصول إلى",
    staffrole_btn_access_suffix: "لوحة التحكم",
    staffrole_btn_password_required: "كلمة المرور مطلوبة",

    staffrole_footer_question: "ليس لديك صلاحية للوصول إلى دور؟",
    staffrole_footer_contact: "اتصل بالمدير",

    staffrole_dialog_title_prefix: "أدخل",
    staffrole_dialog_title_suffix: "كلمة المرور",
    staffrole_dialog_desc: "هذا القسم محمي بكلمة مرور. يرجى إدخال كلمة المرور المقدمة من المدير.",
    staffrole_dialog_password_label: "كلمة المرور",
    staffrole_dialog_password_placeholder: "أدخل كلمة المرور",
    staffrole_dialog_error_notset: "لم يتم تعيين كلمة مرور لهذا الدور. يرجى الاتصال بالمدير.",
    staffrole_dialog_error_required: "يرجى إدخال كلمة المرور",
    staffrole_dialog_error_incorrect: "كلمة المرور غير صحيحة. حاول مرة أخرى.",

    staffrole_dialog_btn_cancel: "إلغاء",
    staffrole_dialog_btn_access: "الدخول إلى لوحة التحكم",
    staffrole_dialog_btn_verifying: "جارٍ التحقق...",
    real_time_school_data: "بيانات المدرسة الحقيقية",




    studentcomm_feed_title: "مشاركات المجتمع",
    studentcomm_feed_subtitle: "اعرض المشاركات وشارك في المناقشات.",

    studentcomm_btn_refresh: "تحديث",
    studentcomm_sorting_prefix: "الترتيب حسب:",
    studentcomm_sort_newest: "الأحدث",
    studentcomm_sort_oldest: "الأقدم",

    studentcomm_filter_placeholder: "تصفية حسب المعلم",
    studentcomm_filter_all: "جميع المعلمين",

    studentcomm_error_title: "⚠ خطأ في جلب المشاركات",
    studentcomm_error_msg_prefix: "حدث خطأ:",
    studentcomm_error_btn: "أعد المحاولة",

    studentcomm_noposts_title: "لا توجد مشاركات",
    studentcomm_noposts_desc: "تحقق لاحقاً لمزيد من التحديثات!",

    studentcomm_post_by_prefix: "بواسطة",
    studentcomm_post_attachments: "المرفقات",
    studentcomm_post_view_replies_prefix: "عرض",
    studentcomm_post_view_replies_suffix: "ردود",

    studentcomm_reply_you: "أنت",
    studentcomm_reply_teacher: "معلم",
    studentcomm_reply_student: "طالب",
    studentcomm_reply_author: "الكاتب",
    studentcomm_reply_with_files: "هذا الرد يحتوي على مرفقات يمكن للكاتب فقط رؤيتها",

    studentcomm_reply_placeholder_enabled: "اكتب رداً...",
    studentcomm_reply_placeholder_disabled:
      "الرد غير متاح لهذا المنشور. ربما قام الكاتب بتعطيل الردود أو قصرها على مجموعات محددة.",

    studentcomm_replyfile_remove: "إزالة الملف",





    studentdash_loading: "جاري تحميل بيانات الطالب...",
    studentdash_error_title: "تعذر تحميل البيانات",
    studentdash_error_msg_prefix: "خطأ:",

    studentdash_sidebar_overview: "نظرة عامة",
    studentdash_sidebar_grades: "علاماتي",
    studentdash_sidebar_schedule: "الجدول",
    studentdash_sidebar_group: "مجموعتي",
    studentdash_sidebar_community: "المجتمع",
    studentdash_sidebar_profile: "الملف الشخصي",
    studentdash_header: "لوحة الطالب",

    studentdash_overview_grade: "المعدل العام",
    studentdash_overview_attendance: "الحضور",
    studentdash_overview_subjects: "المواد",
    studentdash_overview_recentgrades: "آخر العلامات",
    studentdash_overview_nogrades: "لا توجد علامات مسجلة للفصل الأول.",
    studentdash_overview_todaysschedule: "جدول اليوم",
    studentdash_overview_noschedule: "لا توجد حصص مقررة لليوم.",

    studentdash_grades_title: "الأداء الأكاديمي",
    studentdash_grades_subtitle: "علاماتك للسنة الدراسية الحالية.",
    studentdash_grades_trimester_prefix: "الفصل",
    studentdash_grades_trimester_performance_prefix: "أداء الفصل",
    studentdash_grades_average: "المعدل",
    studentdash_grades_coeff: "المعامل",
    studentdash_grades_finalgrade: "العلامة النهائية",
    studentdash_grades_obs: "ملاحظة",
    studentdash_grades_dev1: "اختبار 1",
    studentdash_grades_dev2: "اختبار 2",
    studentdash_grades_exam: "الامتحان",

    studentdash_schedule_title: "الجدول الأسبوعي",
    studentdash_schedule_subtitle: "جدول حصصك لهذا الأسبوع",

    studentdash_group_title: "مجموعتي الدراسية",
    studentdash_group_subtitle: "معلومات عن مجموعتك الدراسية والأساتذة",
    studentdash_group_level: "المستوى",
    studentdash_group_season: "الموسم",
    studentdash_group_yourteachers: "أساتذتك",
    studentdash_group_subject: "المادة",

    studentdash_profile_title: "ملف الطالب",
    studentdash_profile_subtitle: "معلوماتك الشخصية والأكاديمية.",
    studentdash_profile_personalinfo: "المعلومات الشخصية",
    studentdash_profile_academicinfo: "المعلومات الأكاديمية",
    studentdash_profile_parentinfo: "معلومات الوالدين",

    studentdash_profile_fullname: "الاسم الكامل",
    studentdash_profile_email: "البريد الإلكتروني",
    studentdash_profile_phone: "رقم الهاتف",
    studentdash_profile_birthdate: "تاريخ الميلاد",
    studentdash_profile_birthcity: "مدينة الميلاد",
    studentdash_profile_nationality: "الجنسية",
    studentdash_profile_schooltype: "نوع المدرسة",
    studentdash_profile_currentgroup: "المجموعة الحالية",
    studentdash_profile_level: "المستوى",
    studentdash_profile_speciality: "التخصص",

    studentdash_parent_mother: "معلومات الأم",
    studentdash_parent_father: "معلومات الأب",
    studentdash_parent_notavail_mother: "معلومات الأم غير متوفرة.",
    studentdash_parent_notavail_father: "معلومات الأب غير متوفرة.",
    Coeff: "المعامل",






    BTN_CREATE_POST: "إنشاء منشور",
    DIALOG_CREATE_TITLE: "إنشاء منشور جديد",
    DIALOG_CREATE_DESC: "شارك تحديثًا مع طلابك. أرفق ملفات وحدد المجموعات لإشعارها.",
    INPUT_POST_TITLE: "عنوان المنشور",
    INPUT_POST_CONTENT: "بماذا تفكر؟",
    LABEL_VISIBLE_GROUPS: "مرئي للمجموعات",
    LABEL_ATTACH_FILES: "إرفاق ملفات",
    UPLOAD_CLICK: "انقر للرفع",
    BTN_POST: "نشر",
    BTN_POSTING: "جاري النشر...",
  
    POST_EDIT: "تعديل",
    POST_EDIT_TITLE: "تعديل المنشور",
    POST_EDIT_DESC: "قم بتحديث العنوان أو المحتوى أو المجموعات لهذا المنشور.",
    POST_EDIT_FIELD_TITLE: "العنوان",
    POST_EDIT_FIELD_CONTENT: "المحتوى",
    POST_EDIT_VISIBLE_GROUPS: "مرئي للمجموعات",
    POST_EDIT_CANCEL: "إلغاء",
    POST_EDIT_SAVE: "حفظ التغييرات",
    POST_EDIT_SAVING: "جاري الحفظ...",
  
    POST_BY: "بواسطة",
    POST_SELECTED_GROUPS: "المجموعات المحددة :",
    POST_ATTACHMENTS: "المرفقات",
    POST_VIEW_REPLIES: "عرض ",
    POST_VIEW_REPLIES_COUNT: "ردود",
    POST_REPLY_PLACEHOLDER: "اكتب ردًا...",
    POST_REPLY_YOU: "أنت",
    POST_REPLY_TEACHER: "أستاذ",
    POST_REPLY_STUDENT: "طالب",
    POST_REPLY_AUTHOR: "الكاتب",
    POST_REPLY_DOWNLOAD_TITLE: "انقر للتنزيل",
  
    FEED_TITLE: "ساحة المجتمع",
    FEED_DESC: "مناقشات وأسئلة وإعلانات.",
    FEED_REFRESH: "تحديث",
    FEED_ERROR_TITLE: "⚠ خطأ في جلب المنشورات",
    FEED_ERROR_DESC: "حدث خطأ أثناء تحميل المنشورات.",
    FEED_TRY_AGAIN: "أعد المحاولة",
    FEED_NO_POSTS_TITLE: "لم يتم العثور على منشورات",
    FEED_NO_POSTS_DESC: "جرّب تغيير الفلاتر أو أنشئ منشورًا جديدًا!",
    FEED_BTN_ALL: "جميع المنشورات",
    FEED_BTN_MINE: "منشوراتي",
    FEED_SORT_NEWEST: "ترتيب: الأحدث",
    FEED_SORT_OLDEST: "ترتيب: الأقدم",




    teacher_dashboard_title: "لوحة تحكم الأستاذ",
    teacher_dashboard_refresh: "تحديث",
    teacher_dashboard_loading: "جاري تحميل لوحة تحكم الأستاذ...",
    teacher_dashboard_failed_title: "فشل في تحميل البيانات",
    teacher_dashboard_failed_login: "الرجاء تسجيل الدخول مرة أخرى",
    teacher_dashboard_refreshing: "جارٍ تحديث البيانات...",

    teacher_overview_tab: "نظرة عامة",
    teacher_groups_tab: "مجموعاتي",
    teacher_grades_tab: "العلامات",
    teacher_attendance_tab: "الحضور",
    teacher_schedule_tab: "الجدول",
    teacher_community_tab: "المجتمع",
    teacher_meetings_tab: "الاجتماعات",
    teacher_profile_tab: "الملف الشخصي",

    teacher_total_groups: "إجمالي المجموعات",
    teacher_total_students: "إجمالي الطلاب",
    teacher_subjects: "المواد",
    teacher_weeks_classes: "حصص الأسبوع",
    teacher_todays_classes: "حصص اليوم",
    teacher_todays_schedule: "جدول اليوم",
    teacher_no_classes_today: "لا توجد حصص مجدولة لهذا اليوم.",

    teacher_groups_manage: "إدارة مجموعاتك الدراسية وحصصك",
    teacher_groups_students_count: "{count} طالب",
    teacher_groups_view_details: "عرض التفاصيل",

    teacher_grades_manage: "إدارة العلامات",
    teacher_grades_description: "إدخال وإدارة علامات الطلاب لموادك",
    teacher_grades_trimester1: "الفصل 1",
    teacher_grades_trimester2: "الفصل 2",
    teacher_grades_trimester3: "الفصل 3",
    teacher_grades_enter: "إدخال العلامات",
    teacher_grades_view_report: "عرض التقرير",

    teacher_attendance_manage: "إدارة الحضور",
    teacher_attendance_description: "حدد تاريخًا لكل مجموعة وقم بتسجيل حضور الطلاب",
    teacher_attendance_mark: "تسجيل الحضور",

    teacher_schedule_title: "جدول تدريسي",
    teacher_schedule_description: "عرض جدولك الأسبوعي",

    teacher_profile_refresh: "تحديث",
    teacher_profile_contact_admin: "يمكنك دائمًا الاتصال بالإدارة لتحديث ملفك الشخصي",
    teacher_profile_modules: "المواد",
    teacher_profile_no_modules: "لا توجد مواد مسندة بعد",
    teacher_profile_current_groups: "المجموعات الحالية",
    teacher_profile_no_groups: "لا تقوم بالتدريس لأي مجموعة",
    teacher_profile_history: "سجل التدريس",

    teacher_groupdetails_title: "تفاصيل المجموعة",
    teacher_groupdetails_info: "معلومات تفصيلية حول هذه المجموعة بما في ذلك الطلاب والأداء والإحصاءات.",
    teacher_groupdetails_students: "إجمالي الطلاب",
    teacher_groupdetails_subject: "المادة",
    teacher_groupdetails_level: "المستوى",
    teacher_groupdetails_academic_year: "السنة الأكاديمية",
    teacher_groupdetails_statistics: "إحصائيات الأداء",
    teacher_groupdetails_distribution_excellent: "ممتاز (16-20)",
    teacher_groupdetails_distribution_good: "جيد (14-15.99)",
    teacher_groupdetails_distribution_average: "متوسط (10-13.99)",
    teacher_groupdetails_distribution_needs: "يحتاج لتحسين (<10)",
    teacher_groupdetails_attendance_presence: "الحضور",
    teacher_groupdetails_attendance_lateness: "التأخير",
    teacher_groupdetails_attendance_absence: "الغياب",
    teacher_groupdetails_student_list: "قائمة الطلاب",
    teacher_groupdetails_student_list_desc: "جميع الطلاب المسجلين في هذه المجموعة",
    teacher_groupdetails_status_active: "نشط",
    teacher_groupdetails_quick_actions: "إجراءات سريعة",
    teacher_groupdetails_export: "تصدير بيانات المجموعة",

    teacher_modal_grades_title: "إدخال العلامات",
    teacher_modal_grades_description: "أدخل العلامات لجميع الطلاب في هذه المجموعة.المادة: ",
    teacher_modal_grades_module: "لكل طالب 4 تقييمات بالإضافة إلى العلامة النهائية.",
    teacher_modal_grades_close: "إغلاق",
    teacher_modal_loading: "جارٍ التحميل...",

    teacher_attendance_modal_title: "تسجيل الحضور",
    teacher_attendance_modal_description: "قم بتسجيل الحضور للتاريخ المحدد. ضع علامة على الطلاب الحاضرين.",
    teacher_attendance_modal_mark: "تسجيل الحضور",
    teacher_attendance_modal_error: "خطأ أثناء إرسال بيانات الحضور",
    teacher_attendance_modal_success: "تم تسجيل الحضور بنجاح",
    teacher_students: "طلاب",
    teacher_grades_class_average: "المعدل العام للفصل",
    teacher_username: "اسم المستخدم",
    teacher_national_id: "الرقم القومي",
    teacher_student_name: "اسم الطالب",
    teacher_constant_observation: "الملاحظة الثابتة",
    teacher_modal_grades_loading: "تحميل تفاصيل العلامات",
    teacher_modal_grades_description1: "أدخل العلامات لجميع الطلاب في هذه المجموعة. لكل طالب 4 تقييمات بالإضافة إلى العلامة النهائية.",
    Loading_Group_Details: "تحميل تفاصيل المجموعة",
    teacher_groupdetails_group_name: "اسم المجموعة",
    teacher_groupdetails_active_students: "الطلاب النشطين",
    teacher_groupdetails_grade_distribution: "توزيع العلامات",
    teacher_groupdetails_attendance_overview: "ملخص الحضور",
    teacher_groupdetails_class: "الفصل",
    teacher_session: "الحصة",
    teacher_select_session: "اختر الحصة",
    teacher_notes_optional: "الملاحظات (اختياري)",
    Save_Attendance: "حفظ الحضور",





    teacher_dash_title: "لوحة تحكم الأستاذ",
    teacher_active_status: "نشط",

    teacher_total_groups1: "إجمالي المجموعات",
    teacher_total_students1: "إجمالي الطلاب",
    teacher_subjects1: "المواد",
    teacher_today_classes: "حصص اليوم",
    teacher_today_schedule: "جدول اليوم",

    teacher_groups_tab_title: "مجموعاتي",
    teacher_groups_tab_desc: "إدارة مجموعاتك الدراسية وحصصك",
    teacher_groups_students_label: " طالب",
    teacher_groups_view_details1: "عرض التفاصيل",

    teacher_grades_tab_title: "إدارة العلامات",
    teacher_grades_tab_desc: "إدخال وإدارة علامات الطلاب لموادك",
    teacher_grades_class_avg: "متوسط القسم:",
    teacher_grades_enter_btn: "إدخال العلامات",
    teacher_grades_view_report_btn: "عرض التقرير",

    teacher_attendance_tab_title: "إدارة الحضور",
    teacher_attendance_tab_desc: "حدد تاريخًا لكل مجموعة وقم بتسجيل حضور الطلاب",
    teacher_attendance_select_date: "اختر تاريخًا للحضور",
    teacher_attendance_selected_prefix: "المحدد:",
    teacher_attendance_selected_suffix: "",
    teacher_attendance_for_date: "الحضور للتاريخ المحدد:",
    teacher_attendance_mark_btn: "تسجيل الحضور",
    teacher_attendance_view_report_btn: "عرض التقرير",
    teacher_attendance_present: "حاضر",
    teacher_attendance_absent: "غائب",
    teacher_attendance_late: "متأخر",
    teacher_attendance_excused: "معذور",
    teacher_attendance_notes_label: "ملاحظات (اختياري)",
    teacher_attendance_notes_placeholder: "أضف أي ملاحظات حول حضور اليوم...",
    teacher_attendance_save_btn: "حفظ الحضور",

    teacher_schedule_tab_title: "جدولي التدريسي",
    teacher_schedule_tab_desc: "عرض جدولك الأسبوعي",

    teacher_community_title: "مجتمع المدرسة",
    teacher_community_desc: "تواصل مع الزملاء وشارك في مناقشات المدرسة",
    teacher_community_coming: "ميزات المجتمع قريباً",
    teacher_community_subdesc: "تواصل مع معلمين آخرين، شارك الموارد وشارك في النقاشات المدرسية.",

    teacher_settings_title: "إعدادات الأستاذ",
    teacher_settings_desc: "إدارة ملفك الشخصي وتفضيلاتك",
    teacher_settings_personal_info: "المعلومات الشخصية",
    teacher_settings_professional_info: "المعلومات المهنية",
    teacher_settings_account_actions: "إجراءات الحساب",
    teacher_settings_change_password: "تغيير كلمة المرور",
    teacher_settings_update_profile: "تحديث الملف الشخصي",
    teacher_settings_contact_admin: "اتصل بالإدارة لتحديث ملفك الشخصي أو تغيير كلمة المرور.",

    teacher_modal_grades_title_prefix: "إدخال العلامات -",
    teacher_modal_grades_title_suffix: "",
    teacher_modal_grades_desc: "أدخل العلامات لجميع الطلاب في هذه المجموعة. لكل طالب 4 تقييمات بالإضافة إلى العلامة النهائية.",
    teacher_modal_student_name: "اسم الطالب",
    teacher_modal_const_obs: "ملاحظة مستمرة",
    teacher_modal_dev1: "فرض 1",
    teacher_modal_dev2: "فرض 2",
    teacher_modal_exam: "اختبار",
    teacher_modal_final_grade: "العلامة النهائية",
    teacher_modal_actions: "إجراءات",
    teacher_modal_cancel: "إلغاء",
    teacher_modal_save_all: "حفظ جميع العلامات",

    teacher_modal_attendance_title_prefix: "تسجيل الحضور -",
    teacher_modal_attendance_title_suffix: "",
    teacher_modal_attendance_desc: "قم بتسجيل الحضور للتاريخ المحدد. ضع علامة على الطلاب الحاضرين.",
    teacher_modal_attendance_class: "القسم:",
    teacher_modal_attendance_date: "التاريخ:",
    teacher_modal_attendance_subject: "المادة:",
    teacher_modal_attendance_present: "حاضر:",
    teacher_modal_attendance_absent: "غائب:",
    teacher_modal_attendance_total: "الإجمالي:",
    teacher_modal_attendance_close: "إغلاق",

    teacher_modal_report_title_prefix: "تقرير القسم -",
    teacher_modal_report_title_suffix: "",
    teacher_modal_report_desc: "تقرير شامل عن الأداء والحضور لهذا القسم.",
    teacher_modal_report_total_students: "إجمالي الطلاب",
    teacher_modal_report_class_avg: "متوسط القسم",
    teacher_modal_report_attendance_rate: "نسبة الحضور",
    teacher_modal_report_pass_rate: "نسبة النجاح",
    teacher_modal_report_distribution: "توزيع العلامات",
    teacher_modal_report_student_perf: "أداء الطلاب الفردي",
    teacher_modal_report_close: "إغلاق",
    teacher_modal_report_export: "تصدير التقرير",

    teacher_modal_group_title_prefix: "تفاصيل المجموعة -",
    teacher_modal_group_title_suffix: "",
    teacher_modal_group_desc: "معلومات تفصيلية حول هذه المجموعة بما في ذلك الطلاب والأداء والإحصاءات.",
    teacher_modal_group_info: "معلومات المجموعة",
    teacher_modal_group_students: "إجمالي الطلاب:",
    teacher_modal_group_subject: "المادة:",
    teacher_modal_group_level: "المستوى:",
    teacher_modal_group_year: "السنة الدراسية:",
    teacher_modal_group_active_students: "الطلاب النشطون:",
    teacher_modal_group_inactive_students: "الطلاب غير النشطين:",
    teacher_modal_group_room: "القسم:",
    teacher_modal_group_stats: "إحصائيات الأداء",
    teacher_modal_group_grade_dist: "توزيع العلامات",
    teacher_modal_group_attendance_overview: "نظرة عامة على الحضور",
    teacher_modal_group_student_list: "قائمة الطلاب",
    teacher_modal_group_student_list_desc: "جميع الطلاب المسجلين في هذه المجموعة",
    teacher_modal_group_status_active: "نشط",
    teacher_modal_group_quick_actions: "إجراءات سريعة",
    teacher_modal_group_enter_grades: "إدخال العلامات",
    teacher_modal_group_mark_attendance: "تسجيل الحضور",
    teacher_modal_group_view_report: "عرض التقرير",
    teacher_modal_group_close: "إغلاق",
    teacher_modal_group_export: "تصدير بيانات المجموعة",
    experience: "الخبرة",
    qualification: "المؤهل",
    teacher_modal_attendance: "الحضور",
    teacher_modal_group_name: "اسم المجموعة",
    teacher_modal_group_distribution_excellent1: "ممتاز (95-100%)",
    teacher_modal_group_distribution_good1: "جيد (85-94%)",
    teacher_modal_group_distribution_average1: "متوسط (75-84%)",
    teacher_modal_group_distribution_needs1: "يحتاج لتحسين (<75%)",
    Current_Grade: "الصف الحالي",






    teacher_meetings_request_title: "طلب اجتماع",
    teacher_meetings_select_parent: "اختر ولي أمر",
    teacher_meetings_search_placeholder: "ابحث عن ولي الأمر أو الطفل...",
    teacher_meetings_choose_parent: "اختر ولي أمر",

    teacher_meetings_cause_label: "السبب",
    teacher_meetings_select_cause: "اختر السبب",
    teacher_meetings_cause_academic: "الأداء الأكاديمي",
    teacher_meetings_cause_behavioral: "مشاكل سلوكية",
    teacher_meetings_cause_attendance: "مشاكل الحضور",
    teacher_meetings_cause_health: "الصحة والرفاهية",
    teacher_meetings_cause_admin: "طلب إداري",
    teacher_meetings_cause_extra: "أنشطة لا صفية",
    teacher_meetings_cause_followup: "متابعة عامة",
    teacher_meetings_cause_conflict: "حل النزاعات",

    teacher_meetings_date_label: "التاريخ",
    teacher_meetings_notes_label: "ملاحظات (اختياري)",
    teacher_meetings_notes_placeholder: "أضف تفاصيل عن الاجتماع...",
    teacher_meetings_send_request: "إرسال الطلب",

    teacher_meetings_list_title: "اجتماعاتك",
    teacher_meetings_section_action_required: "إجراء مطلوب",
    teacher_meetings_section_upcoming: "الاجتماعات القادمة",
    teacher_meetings_section_pending: "في انتظار الموافقة",
    teacher_meetings_section_archived: "مؤرشف",

    teacher_meetings_with: "اجتماع مع:",
    teacher_meetings_by: "طلب اجتماع من:",
    teacher_meetings_cause_display: "السبب:",
    teacher_meetings_meeting_on: "الاجتماع في:",
    teacher_meetings_scheduled: "مجدول:",
    teacher_meetings_notes: "ملاحظات:",
    teacher_meetings_children: "الأبناء:",

    teacher_meetings_btn_accept: "قبول",
    teacher_meetings_btn_decline: "رفض",
    teacher_meetings_btn_reschedule: "إعادة جدولة",
    teacher_meetings_btn_confirm_date: "تأكيد التاريخ الجديد",
    teacher_meetings_btn_decline_date: "رفض",

    teacher_meetings_empty: "لم يتم العثور على اجتماعات.",
    teacher_meetings_group: "المجموعة:",






    student_dialog_add_title: "إضافة طالب جديد",
    student_dialog_edit_title: "تعديل معلومات الطالب",
    student_dialog_add_desc: "املأ النموذج لإنشاء ملف طالب جديد.",
    student_dialog_edit_desc_prefix: "تعديل الملف لـ",
    student_dialog_edit_desc_suffix: "",

    student_dialog_section_account: "معلومات الحساب",
    student_dialog_section_personal: "المعلومات الشخصية",

    student_dialog_username: "اسم المستخدم",
    student_dialog_full_name: "الاسم الكامل",
    student_dialog_phone: "رقم الهاتف",
    student_dialog_email: "البريد الإلكتروني",
    student_dialog_password: "كلمة المرور",

    student_dialog_password_placeholder_new: "أدخل كلمة المرور",
    student_dialog_password_placeholder_edit: "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية",
    student_dialog_show_password: "عرض كلمة المرور",
    student_dialog_hide_password: "إخفاء كلمة المرور",

    student_dialog_nationality: "الجنسية",
    student_dialog_birth_city: "مدينة الميلاد",
    student_dialog_birth_date: "تاريخ الميلاد",
    student_dialog_sex: "الجنس",
    student_dialog_select_country: "اختر الدولة",
    student_dialog_select_city: "اختر المدينة",
    student_dialog_select_sex: "اختر الجنس",
    student_dialog_male: "ذكر",
    student_dialog_female: "أنثى",

    student_dialog_error: "حدث خطأ أثناء حفظ النموذج.",

    student_dialog_cancel: "إلغاء",
    student_dialog_saving: "جارٍ الحفظ...",
    student_dialog_update: "تحديث الطالب",
    student_dialog_add: "إضافة الطالب",
    student_dialog_group_history: "سجل المجموعة",




    emp_finance_title: "التمويل الوظيفي",
    emp_finance_subtitle: "إدارة الرواتب وتتبع الملفات المالية لجميع الموظفين والمعلمين.",

    emp_finance_total_employees: "إجمالي الموظفين",
    emp_finance_finance_complete: "الرواتب مكتملة",
    emp_finance_pending_payroll: "رواتب قيد المعالجة",
    emp_finance_estimated_payroll: "الراتب الشهري التقديري",

    emp_finance_search_placeholder: "ابحث بالاسم أو المنصب...",
    emp_finance_filter_department: "تصفية حسب القسم",
    emp_finance_filter_status: "تصفية حسب الحالة",
    emp_finance_filter_all_departments: "كل الأقسام",
    emp_finance_filter_all_statuses: "كل الحالات",
    emp_finance_filter_done: "مكتمل",
    emp_finance_filter_pending: "قيد الانتظار",
    emp_finance_filter_undone: "بدون راتب",

    emp_finance_add_staff_btn: "إضافة موظف",

    emp_finance_no_employee_title: "لم يتم العثور على موظفين",
    emp_finance_no_employee_subtitle: "حاول تعديل معايير البحث أو التصفية.",

    emp_finance_dialog_add_title: "إضافة موظف جديد",
    emp_finance_dialog_edit_title: "تعديل الملف المالي",
    emp_finance_dialog_add_desc: "املأ التفاصيل لإضافة موظف جديد إلى قائمة الرواتب.",
    emp_finance_dialog_edit_desc: "قم بتحديث التفاصيل المالية لهذا الموظف.",

    emp_finance_form_name: "الاسم الكامل",
    emp_finance_form_position: "المنصب",
    emp_finance_form_department: "القسم",
    emp_finance_form_hire_date: "تاريخ التوظيف",
    emp_finance_form_salary: "الراتب",
    emp_finance_form_bank_account: "رقم الحساب البنكي",
    emp_finance_form_status: "حالة التوظيف",
    emp_finance_form_select_status: "اختر الحالة",
    emp_finance_form_status_active: "نشط",
    emp_finance_form_status_inactive: "غير نشط",

    emp_finance_btn_cancel: "إلغاء",
    emp_finance_btn_save: "حفظ التغييرات",
    emp_finance_btn_create: "إنشاء الملف",

    emp_finance_attendance_title: "تقرير الحضور لآخر 30 يومًا",
    emp_finance_attendance_desc_prefix: "سجل الحضور لمدة 30 يومًا لـ",
    emp_finance_attendance_desc_suffix: "",
    emp_finance_attendance_col_date: "التاريخ",
    emp_finance_attendance_col_status: "الحالة",
    emp_finance_attendance_col_time: "الوقت",
    emp_finance_no_attendance: "لا توجد سجلات حضور لهذا الموظف.",

    emp_finance_transaction_title: "سجل المعاملات",
    emp_finance_transaction_desc_prefix: "جميع المدفوعات المسجلة لـ",
    emp_finance_transaction_desc_suffix: "",
    emp_finance_transaction_col_date: "التاريخ",
    emp_finance_transaction_col_desc: "الوصف",
    emp_finance_transaction_col_type: "النوع",
    emp_finance_transaction_col_amount: "المبلغ",
    emp_finance_no_transactions: "لا توجد معاملات صالحة لهذا الموظف.",

    emp_finance_payroll_title: "معالجة الرواتب",
    emp_finance_payroll_desc_prefix: "تطبيق الضرائب والخصومات قبل تأكيد دفع الراتب لـ",
    emp_finance_payroll_desc_suffix: "",
    emp_finance_payroll_base_salary: "الراتب الأساسي",
    emp_finance_payroll_tax_percent: "نسبة الضريبة (%)",
    emp_finance_payroll_absence_penalty: "خصم الغياب",
    emp_finance_payroll_late_penalty: "خصم التأخير",
    emp_finance_payroll_final_salary: "الراتب النهائي",
    emp_finance_payroll_confirm_btn: "تأكيد والدفع",

    emp_finance_profile_monthly_salary: "الراتب الشهري",
    emp_finance_profile_last_payment: "آخر دفعة",
    emp_finance_profile_absence_report: "تقرير الغياب",
    emp_finance_profile_not_set: "غير محدد",
    emp_finance_profile_na: "غير متاح",

    emp_finance_profile_btn_view: "عرض",
    emp_finance_profile_btn_edit: "تعديل",
    emp_finance_profile_btn_delete: "حذف",
    emp_finance_profile_btn_pay_salary: "دفع الراتب",

    emp_finance_status_complete: "مكتمل",
    emp_finance_status_pending: "قيد الانتظار",
    emp_finance_status_no_salary: "بدون راتب",

    emp_finance_attendance_present: "حاضر",
    emp_finance_attendance_absent: "غائب",
    emp_finance_attendance_late: "متأخر",
    emp_finance_attendance_justified: "مُبرّر",
    emp_finance_attendance_holiday: "عطلة",
    emp_finance_attendance_rest: "يوم راحة",
    emp_finance_attendance_unknown: "غير معروف",





    fin_dash_title: "لوحة التحكم المالية",
    fin_dash_subtitle: "نظرة شاملة على الوضع المالي للمؤسسة.",

    fin_dash_period_label: "اختر الفترة",
    fin_dash_period_overall: "إجمالي",
    fin_dash_period_select: "اختر الفترة",

    fin_dash_stat_net_profit: "صافي الربح",
    fin_dash_stat_total_income: "إجمالي الدخل",
    fin_dash_stat_total_expenses: "إجمالي المصروفات",
    fin_dash_stat_profiles: "الملفات المسجلة",
    fin_dash_profiles_students: "الطلاب",
    fin_dash_profiles_teachers: "المعلمين",
    fin_dash_profiles_staff: "الموظفين / العاملين",

    fin_dash_breakdown_title: "تحليل مالي",
    fin_dash_breakdown_desc: "تحليل الدخل والمصروفات للفترة المحددة.",
    fin_dash_breakdown_income: "مصادر الدخل",
    fin_dash_breakdown_expense: "فئات المصروفات",
    fin_dash_breakdown_no_income: "لا توجد بيانات دخل متاحة.",
    fin_dash_breakdown_no_expense: "لا توجد بيانات مصروفات متاحة.",

    fin_dash_monthly_title: "الأداء الشهري",
    fin_dash_monthly_desc: "الدخل مقابل المصروفات خلال الأشهر الماضية.",

    fin_dash_transactions_title: "المعاملات",
    fin_dash_transactions_desc: "آخر 10 معاملات للمؤسسة",
    fin_dash_transactions_search_placeholder: "بحث...",
    fin_dash_transactions_type_placeholder: "النوع",
    fin_dash_transactions_filter_all: "الكل",
    fin_dash_transactions_filter_income: "الدخل",
    fin_dash_transactions_filter_expense: "المصروف",
    fin_dash_transactions_col_details: "التفاصيل",
    fin_dash_transactions_col_amount: "المبلغ",
    fin_dash_no_transactions_title: "لم يتم العثور على معاملات.",
    fin_dash_no_transactions_subtitle: "حاول تعديل عوامل التصفية.",

    fin_dash_no_data_title: "لا توجد بيانات مالية متاحة",
    fin_dash_no_data_desc: "لم يتم استرجاع بيانات من الخادم.",
    fin_dash_loading_msg: "جارٍ تحميل لوحة التحكم المالية...",





    fin_set_title: "إعدادات المالية",
    fin_set_subtitle: "تكوين تفضيلات ونظام الإعدادات الافتراضية المالية",
    fin_set_save_btn: "حفظ الإعدادات",
    fin_set_save_alert: "تم حفظ الإعدادات بنجاح!",

    fin_set_general_title: "الإعدادات العامة",
    fin_set_general_desc: "إعدادات النظام المالي الأساسية",
    fin_set_currency_label: "العملة الافتراضية",
    fin_set_tax_label: "نسبة الضريبة (%)",
    fin_set_payroll_label: "تكرار كشوف المرتبات",
    fin_set_fiscal_label: "بداية السنة المالية",

    fin_set_student_title: "إعدادات دفع الطلاب",
    fin_set_student_desc: "تكوين خيارات الرسوم والمدفوعات للطلاب",
    fin_set_auto_reminder_label: "تذكيرات الدفع التلقائية",
    fin_set_auto_reminder_desc: "إرسال تذكيرات تلقائية للمدفوعات القادمة والمتأخرة",
    fin_set_late_fee_label: "غرامة التأخير",
    fin_set_late_fee_hint: "المبلغ المفروض على المدفوعات المتأخرة ",
    fin_set_grace_label: "فترة السماح (أيام)",
    fin_set_grace_hint: "عدد الأيام بعد تاريخ الاستحقاق قبل تطبيق الغرامة",

    fin_set_system_title: "معلومات النظام",
    fin_set_system_desc: "حالة ومعلومات النظام الحالية",
    fin_set_system_storage_label: "تخزين البيانات",
    fin_set_system_storage_val: "تخزين المتصفح المحلي",
    fin_set_system_updated_label: "آخر تحديث",

    fin_set_currency_list_usd: "الدولار الأمريكي",
    fin_set_currency_list_eur: "اليورو",
    fin_set_currency_list_gbp: "الجنيه الإسترليني",
    fin_set_currency_list_cad: "الدولار الكندي",
    fin_set_currency_list_aud: "الدولار الأسترالي",
    fin_set_currency_list_jpy: "الين الياباني",
    fin_set_currency_list_cny: "اليوان الصيني",
    fin_set_currency_list_inr: "الروبية الهندية",

    fin_set_payroll_weekly: "أسبوعي",
    fin_set_payroll_biweekly: "كل أسبوعين",
    fin_set_payroll_monthly: "شهري",
    fin_set_payroll_quarterly: "كل ثلاثة أشهر",

    fin_set_fiscal_jan: "يناير",
    fin_set_fiscal_feb: "فبراير",
    fin_set_fiscal_mar: "مارس",
    fin_set_fiscal_apr: "أبريل",
    fin_set_fiscal_may: "مايو",
    fin_set_fiscal_jun: "يونيو",
    fin_set_fiscal_jul: "يوليو",
    fin_set_fiscal_aug: "أغسطس",
    fin_set_fiscal_sep: "سبتمبر",
    fin_set_fiscal_oct: "أكتوبر",
    fin_set_fiscal_nov: "نوفمبر",
    fin_set_fiscal_dec: "ديسمبر",




    inc_out_total_income: "إجمالي الإيرادات",
    inc_out_total_expenses: "إجمالي المصروفات",
    inc_out_net_flow: "صافي التدفق",
    inc_out_search_placeholder: "ابحث في المعاملات...",
    inc_out_from_label: "من",
    inc_out_to_label: "إلى",
    inc_out_add_btn: "إضافة",
    inc_out_record_title: "تسجيل معاملة",
    inc_out_select_type_placeholder: "اختر النوع",
    inc_out_type_income: "دخل",
    inc_out_type_expense: "مصروف",
    inc_out_amount_placeholder: "المبلغ",
    inc_out_description_placeholder: "الوصف",
    inc_out_save_btn: "حفظ",
    inc_out_no_payment_method: "غير متوفر",
    inc_out_transaction_student_fees: "رسوم الطالب: ",
    inc_out_transaction_salary: "الراتب: ",



    emp_finance_missing_profiles: "الملفات المالية المفقودة",
    emp_finance_missing_profiles_desc: "بعض الطلاب والمعلمين ليس لديهم ملفات مالية. قم بإنشائها لإدارة الرواتب والدفعات.",
    emp_finance_missing_profiles_desc_suffix: "",
    emp_finance_create_all: "إنشاء الكل",
    emp_finance_all_profiles_created: "تم إنشاء جميع الملفات المالية",
    emp_finance_all_profiles_created_desc: "كل طالب ومعلم لديه ملف مالي.",





    staffdb_title: "قاعدة بيانات الموظفين",
    staffdb_description:
      "إدارة الموظفين دون منحهم حسابات في النظام. خزّن معلومات الاتصال والتفاصيل.",
    staffdb_add_btn: "إضافة موظف",
    staffdb_add_new_title: "إضافة موظف جديد",
    staffdb_edit_title: "تعديل معلومات الموظف",
    staffdb_add_description: "أضف موظفًا جديدًا إلى قاعدة البيانات",
    staffdb_edit_description: "تحديث معلومات الموظف",
    staffdb_label_fullname: "الاسم الكامل",
    staffdb_label_position: "الوظيفة",
    staffdb_label_department: "القسم",
    staffdb_label_phone: "رقم الهاتف",
    staffdb_label_email: "عنوان البريد الإلكتروني",
    staffdb_label_address: "العنوان",
    staffdb_label_emergency: "جهة الاتصال للطوارئ",
    staffdb_label_notes: "ملاحظات",
    staffdb_placeholder_address: "العنوان الكامل...",
    staffdb_placeholder_emergency: "الاسم ورقم الهاتف",
    staffdb_placeholder_notes: "معلومات إضافية...",
    staffdb_btn_add_member: "إضافة موظف",
    staffdb_btn_update_member: "تحديث الموظف",
    staffdb_btn_cancel: "إلغاء",
    staffdb_search_placeholder: "ابحث عن الموظفين...",
    staffdb_btn_view: "عرض",
    staffdb_btn_edit: "تعديل",
    staffdb_btn_delete: "حذف",
    staffdb_delete_confirm: "هل أنت متأكد أنك تريد حذف هذا الموظف؟",
    staffdb_no_staff_title: "لم يتم العثور على موظفين",
    staffdb_no_staff_add_text: "ابدأ بإضافة أول موظف إلى قاعدة البيانات",
    staffdb_no_staff_search_text: "لا يوجد موظفون يطابقون معايير البحث الخاصة بك",
    staffdb_add_first_btn: "إضافة أول موظف",
    staffdb_total_staff: "إجمالي الموظفين",
    staffdb_total_staff_desc: "عدد الموظفين في قاعدة البيانات",
    staffdb_departments: "الأقسام",
    staffdb_departments_desc: "عدد الأقسام المختلفة",
    staffdb_recent_additions: "الإضافات الحديثة",
    staffdb_recent_additions_desc: "تمت الإضافة هذا الأسبوع",
    staffdb_view_title: "تفاصيل الموظف",
    staffdb_view_description_prefix: "معلومات كاملة عن",
    staffdb_section_basic: "المعلومات الأساسية",
    staffdb_section_contact: "معلومات الاتصال",
    staffdb_section_additional: "ملاحظات إضافية",
    staffdb_field_fullname: "الاسم الكامل",
    staffdb_field_position: "الوظيفة",
    staffdb_field_department: "القسم",
    staffdb_field_added_date: "تاريخ الإضافة",
    staffdb_field_phone: "رقم الهاتف",
    staffdb_field_email: "البريد الإلكتروني",
    staffdb_field_address: "العنوان",
    staffdb_field_emergency: "جهة الاتصال للطوارئ",
    staffdb_field_notes: "ملاحظات",
    staffdb_btn_close: "إغلاق",
    staffdb_added_label: "تاريخ الإضافة:",
    staffdb_emergency_label_prefix: "الطوارئ:",






    stdpay_title: "مدفوعات الطلاب",
    stdpay_description: "إدارة وتتبع جميع المعاملات المالية للطلاب.",
    stdpay_card_students: "الطلاب المسجلون",
    stdpay_card_transactions: "إجمالي المعاملات",
    stdpay_card_revenue: "إجمالي الإيرادات",
    stdpay_card_average: "متوسط ​​المدفوعات",
    stdpay_filter_placeholder: "تصفية حسب الحالة",
    stdpay_filter_all: "جميع الطلاب",
    stdpay_filter_due: "⚠️ الدفع مستحق",
    stdpay_filter_never: "لم يتم الدفع أبدًا",
    stdpay_filter_monthly: "الخطة الشهرية",
    stdpay_filter_quarterly: "الخطة ربع السنوية",
    stdpay_filter_yearly: "الخطة السنوية",
    stdpay_search_placeholder: "ابحث عن الطلاب بالاسم...",
    stdpay_status_paid: "مدفوع بالكامل",
    stdpay_status_due: "مستحق قريبًا",
    stdpay_status_overdue: "متأخر عن الدفع",
    stdpay_status_never: "لم يُدفع مطلقًا",
    stdpay_plan_label: "الخطة",
    stdpay_last_payment: "آخر دفعة",
    stdpay_next_due: "تاريخ الاستحقاق القادم",
    stdpay_btn_record_payment: "تسجيل دفعة",
    stdpay_btn_view_details: "عرض التفاصيل",
    stdpay_no_students_title: "لم يتم العثور على طلاب",
    stdpay_no_students_text: "حاول تعديل البحث أو معايير التصفية.",
    stdpay_dialog_record_title: "تسجيل دفعة جديدة",
    stdpay_dialog_record_for_prefix: "للطالب:",
    stdpay_label_amount: "المبلغ",
    stdpay_label_description: "الوصف",
    stdpay_label_plan: "الخطة",
    stdpay_label_method: "طريقة الدفع",
    stdpay_placeholder_amount: "المبلغ بـ ",
    stdpay_option_monthly: "شهري",
    stdpay_option_quarterly: "ربع سنوي",
    stdpay_option_yearly: "سنوي",
    stdpay_option_cash: "نقدًا",
    stdpay_option_card: "بطاقة",
    stdpay_option_bank: "تحويل بنكي",
    stdpay_btn_save: "حفظ الدفعة",
    stdpay_btn_saving: "جارٍ الحفظ...",
    stdpay_error_submit: "فشل حفظ الدفعة. حاول مرة أخرى لاحقًا.",
    stdpay_dialog_history_title: "سجل المعاملات",
    stdpay_dialog_history_prefix: "جميع الدفعات المسجلة لـ",
    stdpay_table_date: "التاريخ",
    stdpay_table_desc: "الوصف",
    stdpay_table_plan: "الخطة",
    stdpay_table_method: "الطريقة",
    stdpay_table_amount: "المبلغ",
    stdpay_table_no_data: "لا توجد معاملات لهذا الطالب.",
    stdpay_total_paid: "إجمالي المدفوع:",





    school_settings_loading: "جاري تحميل إعدادات المدرسة...",
    school_settings_loading_text: "جاري تحميل إعدادات المدرسة...",
    school_settings_title: "إعدادات المدرسة العامة",
    school_settings_description:
      "قم بإدارة التفاصيل الأساسية والموقع الخاص بمدرستك. سيتم تطبيق التغييرات على جميع أجزاء النظام.",
    school_settings_general_info: "المعلومات العامة",
    school_settings_school_name: "اسم المدرسة",
    school_settings_school_type: "نوع المدرسة",
    school_settings_derivation_key: "مفتاح الاشتقاق",
    school_settings_location_coords: "إحداثيات الموقع",
    school_settings_latitude: "خط العرض (X)",
    school_settings_longitude: "خط الطول (Y)",
    school_settings_drag_pin: "يمكنك أيضًا تعيين الموقع عن طريق سحب العلامة على الخريطة.",
    school_settings_location_map: "خريطة موقع المدرسة",
    school_settings_error_auth: "فشل المصادقة.",
    school_settings_error_unknown: "حدث خطأ غير معروف.",
    school_settings_error_save: "فشل حفظ الإعدادات.",
    school_settings_success_update: "تم تحديث إعدادات المدرسة بنجاح!",
    school_settings_save_changes: "حفظ التغييرات",






    signup_title: "ابدأ مع ",
    signup_title_suffix: "Directis ",
    signup_title_suffix_2: "360",
    signup_subtitle: "انضم إلى شبكة المدارس التي تطور التعليم في الجزائر",
    signup_selected_plan: "الخطة المختارة:",
    signup_selected_plan_placeholder: "اختر خطة",
    signup_plan_includes: "ما الذي تتضمنه الخطة:",
    signup_plan_see_included: "انظر ما هو متضمن",
    signup_school_info_title: "معلومات المدرسة",
    signup_school_info_desc:
      "أخبرنا عن مدرستك وسنقوم بإعدادك بالخطة المناسبة لك",
    signup_fullname_label: "الاسم الكامل",
    signup_fullname_placeholder: "أدخل اسمك الكامل",
    signup_schoolname_label: "اسم المدرسة",
    signup_schoolname_placeholder: "أدخل اسم المدرسة",
    signup_email_label: "البريد الإلكتروني",
    signup_email_placeholder: "school@example.com",
    signup_phone_label: "رقم الهاتف",
    signup_phone_placeholder: "+213 XXX XXX XXX",
    signup_phone_desc: "سنستخدم هذا للتواصل معك حول إعدادك",
    signup_submit: "ابدأ الآن",
    signup_submitting: "جارٍ الإرسال...",
    signup_success_title: "شكرًا على اهتمامك!",
    signup_success_desc:
      "لقد استلمنا طلب التسجيل وسنتصل بك خلال 24 ساعة لإعداد مدرستك على Directis 360.",
    signup_submit_another: "إرسال طلب آخر",
    signup_plan_starter_name: "الخطة الأساسية",
    signup_plan_starter_price: "1,500 دج / لكل طالب",
    signup_plan_starter_desc: "مثالية للمدارس الصغيرة حتى 100 طالب",
    signup_plan_prof_name: "الخطة الاحترافية",
    signup_plan_prof_price: "3,000 دج / شهريًا",
    signup_plan_prof_desc: "مثالية لمعظم المدارس حتى 300 طالب",
    signup_plan_enterprise_name: "خطة المؤسسات",
    signup_plan_enterprise_price: "سعر مخصص",
    signup_plan_enterprise_desc: "للجامعات أو المؤسسات ذات الطلاب غير المحدودين",
    signup_plan_feature_1: "حتى 100 طالب",
    signup_plan_feature_2: "لوحات معلومات أساسية",
    signup_plan_feature_3: "إدارة الدرجات",
    signup_plan_feature_4: "تحليلات متقدمة",
    signup_plan_feature_5: "وصول إلى واجهة API",
    signup_plan_feature_6: "دعم ذو أولوية",
    signup_plan_popular: "الأكثر شيوعًا",
    signup_logo_alt: "شعار Directis",
    signup_plan_more_features: "مزيد من الميزات",








    gm_title: "إدارة الأقسام",
    gm_subtitle_prefix: "إنشاء وإدارة أقسام الطلاب لـ ",
    gm_subtitle_suffix: "مدرستك",
    gm_btn_reload: "تحديث",
    gm_btn_create_group: "إنشاء قسم",
    gm_btn_apply_season: "تطبيق الفلترة حسب الموسم",
    gm_btn_clear: "مسح",
    gm_btn_cancel: "إلغاء",
    gm_btn_create: "إنشاء القسم",
    gm_btn_view: "عرض",
    gm_btn_delete: "حذف",
    gm_btn_close: "إغلاق",
    gm_alert_no_school_type_title: "لم يتم تحديد نوع المدرسة",
    gm_alert_no_school_type_desc:
      "يرجى تحديد نوع المدرسة في الإعدادات قبل إدارة الأقسام.",
    gm_no_groups_title: "لا توجد أقسام",
    gm_no_groups_desc_start: "أنشئ أول قسم للبدء",
    gm_no_groups_desc_filter: "جرّب تعديل خيارات البحث",
    gm_no_groups_btn: "إنشاء أول قسم",
    gm_filter_title: "بحث وتصفية",
    gm_search_placeholder: "ابحث عن الأقسام بالاسم",
    gm_filter_grade_placeholder: "تصفية حسب المستوى",
    gm_filter_status_placeholder: "تصفية حسب التخصص",
    gm_filter_all_levels: "كل المستويات",
    gm_filter_all_specialities: "كل التخصصات",
    gm_filter_start_year_placeholder: "سنة البداية (مثلاً 2023)",
    gm_filter_end_year_placeholder: "سنة النهاية (مثلاً 2026)",
    gm_filter_invalid_range: "نطاق غير صالح",
    gm_filter_currently_showing: "يتم عرض الأقسام من الموسم:",
    gm_create_title: "إنشاء قسم جديد",
    gm_create_desc_prefix: "إنشاء قسم طلابي جديد لـ ",
    gm_create_desc_suffix: "المدرسة",
    gm_loading: "جارٍ التحميل...",
    gm_academic_info: "المعلومات الأكاديمية",
    gm_required_notice: "الحقول المشار إليها بـ ",
    gm_school_level: "مستوى المدرسة",
    gm_configured_by: "(تم ضبطه من قبل المدير)",
    gm_speciality_label: "التخصص",
    gm_select_speciality_placeholder: "الرجاء اختيار التخصص",
    gm_level_label: "المستوى",
    gm_select_level_placeholder: "اختر المستوى",
    gm_select_speciality_first: "(اختر التخصص أولاً)",
    gm_room_season_details: "تفاصيل القاعة والموسم",
    gm_season_label: "الموسم",
    gm_select_season_placeholder: "اختر الموسم",
    gm_subject_assignment: "تعيين المواد",
    gm_subject_details_format: "{speciality} - {level} {suffix}",
    gm_coef_label: "المعامل",
    gm_obligatory: "إجباري",
    gm_optional: "اختياري",
    gm_no_subjects_message: "يرجى اختيار التخصص والمستوى لعرض المواد المتاحة",
    gm_error_general: "فشل إنشاء القسم. حاول مرة أخرى.",
    gm_view_title: "تفاصيل القسم",
    gm_view_desc_prefix: "معلومات كاملة حول ",
    gm_basic_info: "المعلومات الأساسية",
    gm_label_group_name: "اسم القسم",
    gm_label_school_type: "نوع المدرسة",
    gm_label_speciality: "التخصص",
    gm_label_created_date: "تاريخ الإنشاء",
    gm_modules_teachers: "الوحدات والأساتذة",
    gm_teacher_assigned: "تم تعيين أستاذ",
    gm_no_teacher: "لم يُعيّن أستاذ",
    gm_delete_title: "حذف القسم؟",
    gm_delete_warning: "هل أنت متأكد من حذف هذا القسم؟ سيؤدي ذلك إلى حذف:",
    gm_delete_list1: "جميع تسجيلات الطلاب في هذا القسم",
    gm_delete_list2: "جميع تعيينات الأساتذة لهذا القسم",
    gm_delete_list3: "جميع العلامات المرتبطة بهذا القسم",
    gm_delete_irreversible: "هذا الإجراءه.",
    gm_delete_irreversible_desc: " لا يمكن التراجع عنه",
    gm_delete_cancel: "إلغاء",
    gm_delete_confirm: "حذف",
    gm_deleting: "جارٍ الحذف...",
    gm_label_room: "القاعة",
    gm_label_teachers: "الأساتذة المعينة",
    gm_label_created: " الإنشاء",
    gm_required_notice_suffix: "هي إلزامية للتعبئة",









    mm_title_loading: "جارٍ تحميل جميع الاجتماعات...",
    mm_title_error: "خطأ في جلب البيانات",
    mm_error_description: "فشل في جلب الاجتماعات.",
    mm_retry_btn: "إعادة المحاولة",
    mm_no_meetings: "لا توجد اجتماعات.",

    mm_toast_error_load_title: "حدث خطأ أثناء تحميل الاجتماعات",
    mm_toast_error_load_desc: "حدث خطأ غير معروف أثناء تحميل الاجتماعات",
    mm_toast_success_action: "تم تحديث الاجتماع بنجاح",
    mm_toast_error_action: "فشل في تنفيذ الإجراء على الاجتماع",

    mm_confirm_delete: "هل أنت متأكد أنك تريد حذف هذا الاجتماع نهائيًا؟",

    mm_section_action_required: "يتطلب إجراء (طلبات جديدة)",
    mm_section_upcoming: "الاجتماعات القادمة والمجدولة",
    mm_section_reschedule: "قيد إعادة الجدولة",
    mm_section_archived: "الأرشيف / الاجتماعات المغلقة",

    mm_meeting_with: "اجتماع مع",
    mm_requested_on: "تم الطلب في",
    mm_scheduled: "تمت جدولته في",
    mm_notes: "ملاحظات",

    mm_btn_approve: "قبول",
    mm_btn_decline: "رفض",
    mm_btn_confirm_reschedule: "تأكيد إعادة الجدولة",
    mm_btn_delete: "حذف",

    mm_status_accepted: "مقبول / مكتمل",
    mm_status_declined: "مرفوض / ملغى",
    mm_status_inprogress: "جارٍ التنفيذ / نشط",
    mm_status_pending: "في انتظار المراجعة",









        // Tabs
        pm_tab_link_parent: "ربط ولي الأمر بالطالب",
        pm_tab_create_parent: "إنشاء حساب ولي أمر جديد",
    
        // Link tab
        pm_link_title: "ربط الحسابات",
        pm_link_description: "قم بربط حساب ولي أمر موجود بحساب الطالب.",
        pm_select_student_label: "اختر الطالب",
        pm_select_student_placeholder: "اختر طالبًا...",
        pm_select_parent_label: "اختر ولي الأمر",
        pm_select_parent_placeholder: "اختر ولي أمر...",
        pm_relationship_label: "صلة القرابة بالطالب",
        pm_relationship_placeholder: "اختر صلة القرابة",
        pm_relationship_father: "الأب",
        pm_relationship_mother: "الأم",
        pm_error_select_both: "يرجى اختيار الطالب وولي الأمر معًا.",
        pm_error_auth_failed: "فشل في المصادقة.",
        pm_success_linked: "تم ربط ولي الأمر بالطالب بنجاح!",
        pm_link_btn: "ربط الحسابات",
        pm_link_loading: "جارٍ الربط...",
    
        // Create parent tab
        pm_create_title: "إنشاء حساب ولي أمر",
        pm_create_description: "قم بإنشاء حساب جديد لولي الأمر. يمكن ربطه بواحد أو أكثر من الطلاب.",
        pm_label_full_name: "الاسم الكامل",
        pm_label_email: "البريد الإلكتروني",
        pm_label_phone: "رقم الهاتف",
        pm_label_nid: "رقم التعريف الوطني",
        pm_label_username: "اسم المستخدم",
        pm_label_password: "كلمة المرور",
        pm_label_declared_relationship: "صلة القرابة المعلنة",
        pm_success_create: "تم إنشاء حساب ولي الأمر بنجاح!",
        pm_error_create: "فشل في إنشاء الحساب.",
        pm_btn_create: "إنشاء الحساب",
        pm_btn_loading: "جارٍ الإنشاء...",
    
        // Alerts
        pm_alert_error_title: "خطأ",
        pm_alert_success_title: "تم بنجاح",










        po_loading_text: "جارٍ تحميل البيانات...",

        po_title: "نظرة عامة على البيداغوجيا",
        po_description: "ملخص فوري لعمليات المدرسة الأكاديمية.",
        po_back_btn: "العودة إلى لوحة التحكم الرئيسية",
    
        po_total_students: "إجمالي الطلاب",
        po_total_teachers: "إجمالي المعلمين",
        po_active_groups: "المجموعات النشطة",
        po_unassigned_students: "الطلاب غير المعينين",
        po_students_change: " طالب جديد خلال آخر 30 يومًا",
        po_teachers_change: " لديهم مهام تدريسية",
        po_groups_change_prefix: "للموسم ",
        po_unassigned_change: "بانتظار التوزيع",
    
        po_enrollment_title: "تسجيل الطلاب",
        po_enrollment_description: "تفصيل للطلاب المسجلين مقابل غير المعينين.",
        po_registered_label: "المسجلون",
        po_unassigned_label: "غير المعينين",
    
        po_level_title: "توزيع الطلاب حسب المستوى",
        po_level_description: "عدد الطلاب المسجلين في كل مستوى دراسي.",
        po_no_students_group: "لم يتم تعيين أي طلاب إلى مجموعات بعد.",
    
        po_top_teachers_title: "أفضل المعلمين",
        po_top_teachers_description: "المعلمون الأكثر تكليفًا بالمجموعات.",
        po_no_teachers_group: "لم يتم تعيين أي معلمين إلى مجموعات.",
        po_groups_label: " مجموعات",
    
        po_recent_title: "الأنشطة الأخيرة",
        po_recent_description: "آخر الأنشطة خلال الأيام السبعة الماضية.",
        po_no_activities: "لا توجد أنشطة حديثة للعرض.",
        po_activity_new_student: "طالب جديد تم تسجيله: ",
        po_activity_new_teacher: "تمت إضافة معلم جديد: ",
        po_activity_new_group: "تم إنشاء مجموعة جديدة: ",
    
        po_quick_title: "إجراءات سريعة",
        po_quick_description: "ابدأ بالمهام الشائعة.",
        po_action_add_student_title: "إضافة طالب جديد",
        po_action_add_student_desc: "تسجيل ملف طالب جديد.",
        po_action_add_teacher_title: "إضافة معلم جديد",
        po_action_add_teacher_desc: "تسجيل عضو جديد في طاقم التدريس.",
        po_action_create_group_title: "إنشاء مجموعة جديدة",
        po_action_create_group_desc: "تشكيل فصل أو مجموعة جديدة للطلاب.",
        po_action_assign_students_title: "تعيين الطلاب إلى المجموعات",
        po_action_assign_students_desc: "إدارة توزيع الطلاب على المجموعات.",







        ps_title: "إعدادات البيداغوجيا",
        ps_description: "قم بتكوين التفضيلات والقواعد الخاصة بالنظام التربوي الجزائري",
    
        ps_tab_general: "عام",
        ps_tab_grading: "التقييم",
        ps_tab_subjects: "المواد",
        ps_tab_groups: "المجموعات",
    
        ps_school_schedule_title: "إعدادات جدول المدرسة",
        ps_school_schedule_desc: "قم بتكوين أوقات المدرسة الأساسية وهيكل الحصص",
        ps_start_time_label: "وقت بدء الدوام",
        ps_end_time_label: "وقت نهاية الدوام",
        ps_class_duration_label: "مدة الحصة (بالدقائق)",
        ps_break_duration_label: "مدة الاستراحة (بالدقائق)",
        ps_max_students_label: "الحد الأقصى للطلاب في المجموعة",
        ps_save_general_btn: "حفظ الإعدادات العامة",
    
        ps_feature_title: "إعدادات الميزات",
        ps_feature_desc: "تمكين أو تعطيل ميزات التعليم",
        ps_parent_notif_label: "إشعارات أولياء الأمور",
        ps_parent_notif_desc: "إرسال إشعارات إلى أولياء الأمور حول تقدم الطلاب",
        ps_attendance_label: "تتبع الحضور",
        ps_attendance_desc: "تتبع حضور الطلاب في الحصص",
        ps_grade_reports_label: "تقارير الدرجات",
        ps_grade_reports_desc: "إنشاء وتوزيع تقارير الدرجات",
    
        ps_grading_title: "إعداد نظام التقييم الجزائري",
        ps_grading_desc: "قم بإعداد قواعد التقييم والاختبارات وفقًا للمعايير الجزائرية",
        ps_system_label: "نظام التقييم",
        ps_system_placeholder: "اختر نظام التقييم",
        ps_system_20point: "نظام النقاط من 20 (المعيار الجزائري)",
        ps_system_letter: "الدرجات بالحروف (A-F)",
        ps_system_percentage: "النسبة المئوية",
        ps_system_passfail: "ناجح / راسب",
        ps_passing_label: "الدرجة الدنيا للنجاح",
        ps_passing_placeholder: "مثلاً: 10/20 أو 60% أو C",
        ps_report_frequency_label: "تواتر كشوف النقاط",
        ps_report_frequency_placeholder: "اختر التواتر",
        ps_report_frequency_monthly: "شهريًا",
        ps_report_frequency_quarterly: "فصليًا (ثلاثي)",
        ps_report_frequency_semester: "سداسي",
        ps_report_frequency_annual: "سنوي",
        ps_midterm_label: "اختبارات منتصف الفصل",
        ps_midterm_desc: "تمكين فترات الاختبارات النصفية (المراقبة المستمرة)",
        ps_final_label: "الاختبارات النهائية",
        ps_final_desc: "تمكين فترات الاختبارات النهائية (الامتحانات)",
        ps_save_grading_btn: "حفظ إعدادات التقييم",
    
        ps_subjects_title: "إدارة المواد الدراسية",
        ps_subjects_desc: "قم بإعداد المواد الأساسية والاختيارية من المنهاج الجزائري",
        ps_core_label: "المواد الأساسية",
        ps_add_core_btn: "إضافة مادة أساسية",
        ps_elective_label: "المواد الاختيارية",
        ps_add_elective_btn: "إضافة مادة اختيارية",
        ps_weighting_label: "أوزان المواد (المعاملات)",
        ps_weighting_desc: "تمكين معاملات مختلفة للمواد في حساب المعدل",
        ps_default_weight_label: "المعامل الافتراضي للمادة",
        ps_available_subjects_label: "المواد المتوفرة في المنهاج الجزائري ",
        ps_save_subjects_btn: "حفظ إعدادات المواد",
    
        ps_groups_title: "إعداد المجموعات",
        ps_groups_desc: "تكوين قواعد إنشاء وإدارة المجموعات في النظام الجزائري",
        ps_auto_create_label: "إنشاء المجموعات تلقائيًا",
        ps_auto_create_desc: "إنشاء المجموعات تلقائيًا عند تسجيل الطلاب",
        ps_group_pattern_label: "نمط تسمية المجموعة",
        ps_group_pattern_placeholder: "مثال: {grade} - القسم {section}",
        ps_group_pattern_hint_prefix: "استخدم",
        ps_group_pattern_hint_suffix: "كعناصر متغيرة. مثال: 1AS - القسم أ",
        ps_mixed_label: "مجموعات متعددة المستويات",
        ps_mixed_desc: "السماح للطلاب من مستويات مختلفة في نفس المجموعة",
        ps_max_groups_label: "الحد الأقصى للمجموعات لكل معلم",
        ps_save_groups_btn: "حفظ إعدادات المجموعات",
    
        ps_alert_status_prefix: "حالة الإعدادات:",
        ps_alert_status_suffix:
          "تم تكوين جميع إعدادات التعليم وفقًا للنظام التربوي الجزائري (ابتدائي، متوسط، ثانوي). يتم حفظ التغييرات تلقائيًا.",
        ps_group_pattern_hint_prefix1: "و",









        sm_title: "إدارة الجداول الدراسية",
        sm_description_prefix: "اختر مجموعة لإدارة جدولها الأسبوعي للفصل الدراسي الحالي",
        sm_description_suffix: "الموسم",
        sm_select_group_placeholder: "اختر مجموعة...",
    
        sm_group_schedule_title_prefix: "جدول",
        sm_group_schedule_title_suffix: "",
        sm_level_label: "المستوى",
        sm_specialty_label: "التخصص",
    
        sm_clear_btn: "مسح الجدول",
        sm_save_btn: "حفظ الجدول",
        sm_preview_btn: "معاينة",
        sm_export_btn: "تصدير PDF",
        sm_add_class_btn: "إضافة حصة",
    
        sm_clear_dialog_title: "هل أنت متأكد؟",
        sm_clear_dialog_description: "سيتم حذف جميع الحصص لهذا القسم بشكل دائم. لا يمكن التراجع عن هذا الإجراء.",
        sm_clear_dialog_cancel: "إلغاء",
        sm_clear_dialog_confirm: "نعم، احذف الجدول",
    
        sm_loading_message: "جارٍ تحميل البيانات الأولية...",
    
        sm_edit_class_title: "تعديل الحصة",
        sm_add_class_title: "إضافة حصة جديدة",
        sm_dialog_desc: "املأ تفاصيل الحصة الدراسية.",
    
        sm_day_label: "اليوم",
        sm_day_placeholder: "اختر اليوم",
        sm_subject_label: "المادة",
        sm_subject_placeholder: "اختر المادة",
        sm_start_label: "وقت البداية",
        sm_start_placeholder: "وقت البداية",
        sm_end_label: "وقت النهاية",
        sm_end_placeholder: "وقت النهاية",
        sm_teacher_label: "الأستاذ",
        sm_teacher_placeholder: "اختر الأستاذ",
        sm_teacher_placeholder_no_subject: "اختر المادة أولاً",
        sm_room_label: "القاعة",
        sm_room_placeholder: "مثال: القاعة 101 أو المخبر A",
    
        sm_conflict_title: "تعارض في الجدول",
        sm_conflict_desc_group: "يتعارض هذا التوقيت مع حصة أخرى في نفس المجموعة.",
        sm_conflict_desc_teacher: "الأستاذ مجدول مسبقًا في مجموعة أخرى في نفس الوقت.",
        sm_conflict_desc_room: "القاعة محجوزة مسبقًا لمجموعة أخرى في هذا التوقيت.",
    
        sm_cancel_btn: "إلغاء",
        sm_update_btn: "تحديث الحصة",
        sm_add_btn: "إضافة الحصة",
    
        sm_preview_title_prefix: "معاينة الجدول:",
        sm_preview_desc: "عرض للجدول الأسبوعي (للقراءة فقط).",
        sm_preview_close_btn: "إغلاق",
    
        sm_pdf_title: "الجدول الدراسي",
        sm_pdf_group: "المجموعة",
        sm_pdf_specialty: "التخصص",
        sm_pdf_level: "المستوى",
        sm_pdf_season: "الموسم",
        sm_pdf_teachers_head: "الطاقم التعليمي",
        sm_pdf_subjects_head: "المواد",
        sm_pdf_day_head: "اليوم",
        sm_pdf_time_head: "الوقت",
        sm_clear_dialog_description1: "سيتم حذف هذه الحصة الدراسية. لا يتم حفظ هذا الإجراء إلا عند النقر على 'حفظ الجدول'.",
        sm_delete_btn: "حذف",









        sga_select_group_title: "اختر المجموعة",
        sga_select_group_desc: "اختر مجموعة لإدارة التعيينات للفصل الدراسي الحالي.",
        sga_select_group_placeholder: "اختر مجموعة...",
    
        sga_loading_message: "جارٍ تحميل بيانات الطلاب والمجموعات...",
        sga_error_title: "خطأ",
    
        sga_assigned_members_title: "الأعضاء المعينون",
        sga_pending_assignments_title: "تعيينات قيد الانتظار",
        sga_current_members_title: "الأعضاء الحاليون",
        sga_no_students_msg: "لا يوجد طلاب معينون في هذه المجموعة بعد.",
    
        sga_available_students_title: "الطلاب المتاحون",
        sga_filter_unassigned: "غير معين",
        sga_filter_registered: "مسجل",
        sga_filter_group_placeholder: "تصفية حسب المجموعة...",
        sga_filter_all_compatible: "جميع المجموعات المتوافقة",
        sga_search_placeholder: "ابحث عن الطلاب...",
        sga_in_label: "في:",
        sga_transfer_btn: "نقل",
        sga_assign_btn: "تعيين",
        sga_save_assignments_btn: "حفظ التعيينات",
    
        sga_empty_state_title: "اختر مجموعة",
        sga_empty_state_desc: "اختر مجموعة لبدء تعيين الطلاب.",
    
        sga_transfer_confirm_title: "تأكيد نقل الطالب",
        sga_transfer_confirm_specialty_title: "تأكيد تغيير التخصص",
        sga_transfer_confirm_warning_title: "تحذير: هذا إجراء دائم.",
        sga_transfer_confirm_warning_desc:
          "أنت تقوم بنقل الطالب إلى تخصص آخر. سيتم أرشفة علاماته السابقة وسيبدأ بسجل جديد في المجموعة الجديدة.",
        sga_transfer_confirm_desc_prefix: "هل تريد المتابعة في نقل",
        sga_transfer_confirm_desc_suffix: "إلى",
        sga_transfer_failed_title: "فشل في النقل",
        sga_transfer_cancel_btn: "إلغاء",
        sga_transfer_confirm_btn: "تأكيد النقل",
    
        sga_unassign_confirm_title: "تأكيد إلغاء التعيين",
        sga_unassign_warning_title: "تحذير: سيتم أرشفة علامات الطالب.",
        sga_unassign_warning_desc:
          "سيؤدي إلغاء تعيين هذا الطالب إلى إزالته من المجموعة وأرشفة علاماته الحالية بشكل دائم. هذا الإجراء مخصص للانسحابات.",
        sga_unassign_confirm_desc_prefix: "هل أنت متأكد أنك تريد إلغاء تعيين",
        sga_unassign_confirm_desc_suffix: "؟",
        sga_unassign_failed_title: "فشل في إلغاء التعيين",
        sga_unassign_cancel_btn: "إلغاء",
        sga_unassign_confirm_btn: "تأكيد الإلغاء",
    
        sga_save_confirm_title: "تأكيد التعيينات الجديدة",
        sga_save_confirm_desc: "راجع التعيينات الجديدة قبل الحفظ.",
        sga_save_new_assignments_title: "التعيينات الجديدة:",
        sga_save_loading_msg: "جارٍ حفظ التغييرات...",
        sga_save_success_msg: "تم حفظ التغييرات بنجاح!",
        sga_save_failed_title: "فشل في الحفظ",
        sga_save_cancel_btn: "إلغاء",
        sga_save_confirm_btn: "حفظ",
        sga_save_retry_btn: "إعادة المحاولة",
        sga_save_close_btn: "إغلاق",
        sga_transfer_confirm_desc_suffix2: "سيتم نقل علاماته الحالية بهم.",
        sga_transfer_confirm_desc_suffix1: "إلى المجموعة",
        sga_transfer_confirm_desc_prefix1: "هل أنت متأكد أنك تريد نقل الطالب",









        sm_title1: "إدارة الطلاب",
        sm_desc: "إضافة وإدارة الطلاب في",
        sm_reload_btn: "تحديث",
        sm_add_btn1: "إضافة طالب",
    
        sm_search_filter_title: "البحث والتصفية",
        sm_search_placeholder: "ابحث بالاسم أو اسم المستخدم أو البريد الإلكتروني...",
        sm_filter_placeholder: "تصفية حسب الحالة",
        sm_filter_all: "كل الطلاب",
        sm_filter_registered: "مسجل",
        sm_filter_not_registered: "غير مسجل",
    
        sm_students_title: "الطلاب",
        sm_students_desc: "إدارة جميع الطلاب في النظام",
        sm_no_students_title: "لا يوجد طلاب",
        sm_no_students_desc_has_students: "حاول تعديل معايير البحث",
        sm_no_students_desc_empty: "أضف أول طالب للبدء",
    
        sm_add_dialog_title: "إضافة طالب جديد",
        sm_edit_dialog_title: "تعديل بيانات الطالب",
        sm_dialog_desc1: "املأ تفاصيل الطالب.",
        sm_account_info_title: "معلومات الحساب",
        sm_personal_info_title: "المعلومات الشخصية",
        sm_username: "اسم المستخدم",
        sm_full_name: "الاسم الكامل",
        sm_phone_number: "رقم الهاتف",
        sm_email: "البريد الإلكتروني",
        sm_password: "كلمة المرور",
        sm_password_placeholder_new: "أدخل كلمة المرور",
        sm_password_placeholder_edit: "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية",
        sm_nationality: "الجنسية",
        sm_sex: "الجنس",
        sm_birth_date: "تاريخ الميلاد",
        sm_birth_city: "مدينة الميلاد",
        sm_select_country: "اختر الدولة",
        sm_select_city: "اختر المدينة",
        sm_select_sex: "اختر الجنس",
        sm_male: "ذكر",
        sm_female: "أنثى",
        sm_cancel_btn1: "إلغاء",
        sm_add_student_btn: "إضافة طالب",
        sm_update_student_btn: "تحديث الطالب",
    
        sm_view_account_info: "معلومات الحساب:",
        sm_view_personal_info: "المعلومات الشخصية:",
        sm_view_group_history: "سجل المجموعات:",
        sm_registered_label: "مسجل",
        sm_not_registered_label: "غير مسجل",
        sm_speciality_label: "التخصص",
        sm_close_btn: "إغلاق",
    
        sm_registered_status: "مسجل",
        sm_not_registered_status: "غير مسجل",
        sm_registered_with_group: "مسجل ({groupName})",
    
        sm_error_auth_expired: "انتهت صلاحية الجلسة. يرجى التحديث.",
        sm_error_unexpected: "حدث خطأ غير متوقع.",
        sm_born_prefix: "ولد في",
        sm_view_btn: "عرض",
        sm_edit_btn: "تعديل",
        sm_mother_phone_number: "رقم هاتف الأم",
        sm_father_phone_number: "رقم هاتف الأب",
        sm_years_old: "سنوات",











        tm_title: "إدارة المعلمين",
        tm_desc: "إضافة وإدارة طاقم التدريس لجميع المواد",
        tm_reload_btn: "تحديث",
        tm_add_btn: "إضافة معلم",
    
        tm_school_not_configured_alert_title: "نوع المدرسة غير مُكوّن.",
        tm_school_not_configured_alert_desc_1: "يرجى من المدير إعداد نوع المدرسة من الإعدادات → معلومات المدرسة",
        tm_school_not_configured_alert_desc_2: "قبل إدارة المعلمين.",
        tm_school_not_configured_card_title: "إدارة المعلمين غير متاحة",
        tm_school_not_configured_card_desc: "يجب على المدير تحديد نوع المدرسة قبل إضافة أو إدارة المعلمين. هذا يضمن أن المواد تتناسب مع مستوى المدرسة.",
    
        tm_loading_text: "جارٍ تحميل بيانات المعلمين...",
    
        tm_school_type_label: "نوع المدرسة:",
        tm_subjects_available_label: "مواد متاحة",
    
        tm_search_filter_title: "بحث وتصفية",
        tm_search_placeholder: "ابحث عن المعلمين بالاسم أو اسم المستخدم أو البريد الإلكتروني أو المواد...",
        tm_filter_placeholder: "تصفية حسب الحالة",
        tm_filter_all: "كل الحالات",
        tm_filter_active: "نشط",
        tm_filter_inactive: "غير نشط",
        tm_filter_on_leave: "في إجازة",
    
        tm_teachers_title: "المعلمون",
        tm_teachers_desc: "إدارة جميع المعلمين وموادهم",
        tm_no_teachers_title: "لم يتم العثور على معلمين",
        tm_no_teachers_desc_empty: "أضف أول معلم للبدء",
        tm_no_teachers_desc_has_teachers: "حاول تعديل معايير البحث",
    
        tm_card_id: "المعرف:",
        tm_card_joined: "انضم في:",
        tm_card_modules_label: "المواد",
        tm_card_more_label: "و {count} أخرى",
        tm_card_view_btn: "عرض",
        tm_card_edit_btn: "تعديل",
        tm_card_delete_btn: "حذف",
    
        tm_dialog_add_title: "إضافة معلم جديد",
        tm_dialog_edit_title: "تعديل بيانات المعلم",
        tm_dialog_add_desc: "املأ هذا النموذج لإضافة معلم جديد إلى مدرستك",
        tm_dialog_edit_desc_1: "تحديث المعلومات الخاصة بـ",
        tm_dialog_edit_desc_2: "{teacherName}",
    
        tm_form_basic_info: "المعلومات الأساسية",
        tm_username: "اسم المستخدم",
        tm_full_name: "الاسم الكامل",
        tm_phone_number: "رقم الهاتف",
        tm_national_id: "الرقم الوطني",
        tm_email: "البريد الإلكتروني",
        tm_password: "كلمة المرور",
        tm_password_placeholder_new: "أدخل كلمة المرور",
        tm_password_placeholder_edit: "أدخل كلمة مرور جديدة (اختياري)",
    
        tm_subjects_selected_label: "المواد المختارة",
        tm_subjects_list_label: "المواد المتاحة",
        tm_cancel_btn: "إلغاء",
        tm_add_teacher_btn: "إضافة معلم",
        tm_update_teacher_btn: "تحديث المعلم",
    
        tm_view_title: "تفاصيل المعلم",
        tm_view_desc_part1: "المعلومات الكاملة حول",
        tm_view_desc_part2: "{teacherName}",
        tm_view_assigned_subjects: "المواد المكلف بها",
        tm_view_basic_info: "المعلومات الأساسية",
        tm_view_teaching_history: "سجل التدريس",
        tm_view_history_assigned: "تم تعيينه إلى",
        tm_view_history_removed: "تمت إزالته من",
        tm_view_history_no_data: "لا يوجد سجل تدريس متاح.",
        tm_close_btn: "إغلاق",
    
        tm_error_no_token: "رمز الجلسة غير صالح. يرجى تسجيل الدخول مرة أخرى.",
        tm_error_submit_fail: "فشل في حفظ بيانات المعلم.",
        tm_desc_suffix: "المستوى",
        tm_desc_prefix: "إضافة وإدارة المعلمين ل",
        tm_card_more_label1: "أخرى",
        tm_of_total: "من المجموع",
        tm_created_date: "تاريخ الإنشاء",












        lp_nav_about: "حول",
        lp_nav_features: "الميزات",
        lp_nav_dev_team: "فريق التطوير",
        lp_nav_pricing: "الأسعار",
        lp_dashboard_btn: "لوحة التحكم",
    
        lp_about_badge: "🎓 تحويل التعليم في الجزائر",
        lp_about_title_part1: "المنصة الكاملة لـ",
        lp_about_title_highlight: "إدارة المدرسة الحديثة",
        lp_about_title_part2: "",
        lp_about_desc: "قم بتبسيط إدارة مؤسستك التعليمية من خلال لوحات التحكم للمديرين والمعلمين والطلاب وأولياء الأمور.",
        lp_about_get_started: "ابدأ الآن",
        lp_about_watch_demo: "شاهد العرض",
    
        lp_features_title: "كل ما تحتاجه مدرستك",
        lp_features_desc: "أدوات شاملة لكل فرد في المجتمع المدرسي",
    
        lp_feature_headmaster_title: "لوحة مدير المدرسة",
        lp_feature_headmaster_desc: "إشراف كامل على المدرسة مع تحليلات وتقارير وأدوات إدارية.",
        lp_feature_teacher_title: "بوابة المعلم",
        lp_feature_teacher_desc: "إدارة الفصول والدرجات والحضور والتواصل مع الطلاب وأولياء الأمور.",
        lp_feature_student_title: "بوابة الطالب",
        lp_feature_student_desc: "الوصول إلى الواجبات والدرجات والجداول والتعاون مع الزملاء.",
        lp_feature_parent_title: "وصول ولي الأمر",
        lp_feature_parent_desc: "مراقبة تقدم طفلك وحضوره والتواصل مع المعلمين.",
        lp_feature_admin_title: "لوحة الإدارة",
        lp_feature_admin_desc: "إدارة النظام والمستخدمين والإعدادات التقنية.",
        lp_feature_analytics_title: "التحليلات والتقارير",
        lp_feature_analytics_desc: "رؤى شاملة حول الأداء الأكاديمي وإدارة المدرسة.",
    
        lp_team_title: "تعرف على مطورينا",
        lp_team_desc_prefix: "تم التطوير بواسطة:",
        lp_team_member_1_name: "مراد محمد سعيد",
        lp_team_member_1_role: "مطور خلفية",
        lp_team_member_1_bio: "مطور شامل بخبرة تزيد عن 4 سنوات",
        lp_team_member_2_name: "عمران محمد أيمن",
        lp_team_member_2_role: "مطور واجهة أمامية",
        lp_team_member_2_bio: "مطور ويب بخبرة أكثر من 3 سنوات",
    
        lp_pricing_title: "أسعار بسيطة وشفافة",
        lp_pricing_desc: "اختر الخطة المثالية لمدرستك — بدون رسوم خفية.",
        lp_pricing_plan_starter: "البداية",
        lp_pricing_plan_professional: "المحترفة",
        lp_pricing_plan_enterprise: "المؤسسات",
        lp_pricing_plan_period: "دينار جزائري / طالب",
        lp_pricing_plan_popular: "الأكثر شعبية",
        lp_pricing_plan_get_started: "ابدأ الآن",
        lp_pricing_footer_btn: "ابدأ الآن",
    
        lp_footer_text_part1: "©",
        lp_footer_text_heart: "❤️",
        lp_footer_text_part2: "تم إنشاؤها بحب من أجل التعليم الجزائري.",








        adminManagementTitle1: "إدارة المشرفين",
  adminManagementDesc1: "إدارة حسابات وصلاحيات الطاقم الإداري",

  addAdmin1: "إضافة مشرف",

  successTitle1: "تم بنجاح",

  adminStaffMembers1: "الطاقم الإداري",
  adminStaffMembersDesc1  : "إدارة جميع أعضاء الطاقم الإداري",

  actions1  : "الإجراءات",
  loadingAdminData1: "جاري تحميل بيانات المشرفين...",
  noAdminsFound1: "لم يتم العثور على أي مشرف",

  createNewAdmin1: "إنشاء مشرف جديد",
  editAdmin1: "تعديل المشرف",

  createNewAdminDesc1: "املأ النموذج لإنشاء مشرف جديد.",
  editAdminDesc1: "تحديث معلومات العضو المحدد.",

  leaveBlank1: "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية",

  createAdmin1: "إنشاء",
  saveChanges1: "حفظ التغييرات",

  phoneNumber1: "رقم الهاتف",

  authenticationFailed1: "فشل التحقق من الهوية.",
  passwordTooShort1: "كلمة المرور مطلوبة ويجب أن تكون 8 أحرف على الأقل.",
  passwordTooShortEdit1: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.",

  adminCreatedSuccess1: "تم إنشاء المشرف بنجاح!",
  adminUpdatedSuccess1: "تم تحديث المشرف بنجاح!",

  unknownError1: "حدث خطأ غير معروف.",




  tabPwdMgmt_title1: "إدارة كلمات مرور الأقسام",
    tabPwdMgmt_description:
      "إدارة كلمات المرور الأمنية لكل قسم إداري.",

    tabPwdMgmt_loading: "جاري تحميل إعدادات كلمات المرور...",

    tabPwdMgmt_statusTitle: "حالة كلمات المرور",
    tabPwdMgmt_statusSuffix: " أقسام مؤمنة",
    tabPwdMgmt_configuredLabel: "مُعدّ",

    tabPwdMgmt_tabPedagogy: "البيداغوجيا",
    tabPwdMgmt_tabFinance: "المالية",
    tabPwdMgmt_tabAttendance: "الحضور",
    tabPwdMgmt_tabAssets: "المعدات",

    tabPwdMgmt_descPedagogy:
      "إدارة الطلاب، المعلمين، المجموعات والجداول",
    tabPwdMgmt_descFinance:
      "إدارة المدفوعات، الرواتب والمتابعة المالية",
    tabPwdMgmt_descAttendance:
      "تتبع حضور الموظفين والانضباط",
    tabPwdMgmt_descAssets:
      "إدارة معدات المدرسة والمخزون",

    tabPwdMgmt_stateSet: "مضبوطة",
    tabPwdMgmt_stateNotSet: "غير مضبوطة",

    tabPwdMgmt_btnSetPassword: "تعيين كلمة المرور",
    tabPwdMgmt_btnUpdatePassword: "تحديث كلمة المرور",
    tabPwdMgmt_btnCancel: "إلغاء",
    tabPwdMgmt_btnSave: "حفظ",

    tabPwdMgmt_dialogSetTitle: "تعيين كلمة المرور لـ",
    tabPwdMgmt_dialogUpdateTitle: "تحديث كلمة المرور لـ",
    tabPwdMgmt_dialogCreateDesc:
      "أنشئ كلمة مرور آمنة لهذا القسم الإداري.",
    tabPwdMgmt_dialogUpdateDesc:
      "قم بتحديث كلمة المرور الحالية لهذا القسم.",

    tabPwdMgmt_labelNewPassword: "كلمة المرور الجديدة",
    tabPwdMgmt_labelConfirmPassword: "تأكيد كلمة المرور",
    tabPwdMgmt_placeholderPassword: "أدخل كلمة المرور",
    tabPwdMgmt_placeholderConfirmPassword: "أكد كلمة المرور",

    tabPwdMgmt_errorEmpty: "لا يمكن أن تكون كلمة المرور فارغة",
    tabPwdMgmt_errorTooShort:
      "يجب أن تتكون كلمة المرور من 4 أحرف على الأقل",
    tabPwdMgmt_errorMismatch: "كلمتا المرور غير متطابقتين",
    tabPwdMgmt_errorFetchStatus:
      "تعذر تحميل حالة كلمات المرور من الخادم.",

    tabPwdMgmt_successUpdate: "تم تحديث كلمة المرور بنجاح!",

    tabPwdMgmt_importantLabel: "مهم:",
    tabPwdMgmt_importantNotice:
      "كلمات المرور تحمي أقسامًا إدارية حساسة. لا تشاركها إلا مع الموظفين المخولين.",








      assetAdd_btnAddAsset: "إضافة أصل",
    assetAdd_btnAdd: "إضافة أصل",
    assetAdd_btnAddPlural: "أصول",

    assetAdd_phName: "مثال: حاسوب مكتبي، كرسي طالب",
    assetAdd_phSerial: "مثال: SN00123AD",
    assetAdd_phPurchasePrice: "15000.00",
    assetAdd_phDescription: "مثال: معالج i5، ذاكرة 8GB، قرص SSD",
    assetAdd_phSelectCategory: "اختر الفئة",
    assetAdd_phSelectLocation: "اختر الموقع",

    assetAdd_toastSuccessPrefix: "تمت إضافة",
    assetAdd_toastSuccessSingular: "أصل",
    assetAdd_toastSuccessPlural: "أصول",
    assetAdd_toastErrorFallback:
      "فشل في إضافة الأصل. يرجى المحاولة مرة أخرى.",
    assetAdd_errorAuth: "فشل في المصادقة.",

    assetAdd_multiExamplePrefix: "تم اكتشاف عدة أصول:",
    assetAdd_multiExampleSuffix:
      "سيتم إنشاؤها بأرقام تسلسلية تلقائية",

    assetAdd_totalCostSuffix: "دج",

    assetCatFurniture: "أثاث مدرسي (مكاتب، كراسي، سبورات)",
    assetCatIT: "معدات معلوماتية (حاسوب، طابعات، أجهزة عرض)",
    assetCatLab: "معدات مخبرية (مجاهر، أدوات زجاجية)",
    assetCatSport: "معدات رياضية (كرات، شباك، حصائر)",
    assetCatAV: "معدات سمعية بصرية (تلفاز، كاميرات، مكبرات)",
    assetCatMusic: "آلات موسيقية",
    assetCatBooks: "كتب ومقررات مدرسية",
    assetCatCanteen: "معدات المطعم / المطبخ",
    assetCatMaintenance: "أدوات الصيانة",
    assetCatVehicles: "مركبات خدمية",
    assetCatSecurity: "معدات السلامة (مطفآت، إسعافات أولية)",
    assetCatOther: "أخرى",

    assetLocMainOffice: "المكتب الرئيسي",
    assetLocTeachersRoom: "غرفة الأساتذة",
    assetLocComputerRoom: "قاعة الإعلام الآلي",
    assetLocLibrary: "المكتبة",
    assetLocGym: "القاعة الرياضية",
    assetLocScienceLab: "مخبر العلوم",
    assetLocArtRoom: "قاعة الفنون",
    assetLocMusicRoom: "قاعة الموسيقى",
    assetLocCanteen: "المطعم",
    assetLocStorage: "مخزن",
    assetLocMaintenance: "غرفة الصيانة",
    assetLocClass101: "القسم 101",
    assetLocClass102: "القسم 102",
    assetLocClass201: "القسم 201",
    assetLocOutdoor: "الساحة الخارجية",




  },

  fr: {
    // Navigation & Common
    editAdminDesc2: "Mettre à jour les informations du membre sélectionné.",
    no_active_subscription_title: "Abonnement Inactif",
    no_active_subscription_desc: "Votre école n'a pas d'abonnement actif. Veuillez contacter l'administrateur.",
    no_active_subscription_logout: "Déconnexion",
    dashboard: "Tableau de bord",
    settings: "Paramètres",
    logout: "Déconnexion",
    welcome: "Bienvenue",
    loading: "Chargement...",
    gettingReady: "Préparation en cours...",

    // Login Page
    welcomeTo: "Bienvenue à",
    directis360: "Directis 360",
    streamlinedDashboards:
      "Tableaux de bord simplifiés pour les directeurs, enseignants, étudiants et parents — le tout sur une plateforme sécurisée.",
    signIn: "Se connecter",
    accessDashboard: "Accédez à votre tableau de bord scolaire",
    identificator: "Identifiant",
    enterIdentificator: "Entrez votre identifiant",
    password: "Mot de passe",
    enterPassword: "Entrez votre mot de passe",
    signingIn: "Connexion en cours...",
    headmasterUpgrade: "Êtes-vous directeur et souhaitez-vous améliorer votre école ?",
    joinUs: "Rejoignez-nous",

    // Role Selection
    selectRole: "Sélectionnez votre rôle pour accéder au tableau de bord",
    accessDashboard2: "Accéder au tableau de bord",
    needHelp: "Besoin d'aide ? Contactez votre administrateur système ou",
    contactAdmin: "Contacter l'administrateur",
    viewDocumentation: "voir la documentation",

    // Roles
    bossHeadmaster: "Patron / Directeur",
    bossHeadmasterDesc: "Gestion complète de l'école et administration",
    staffAdmin: "Personnel / Admin",
    staffAdminDesc: "Rôles administratifs et gestion",
    teacher: "Enseignant",
    teacherDesc: "Enseignement et gestion des étudiants",
    student: "Étudiant",
    studentDesc: "Portail étudiant et informations",
    parent: "Parent",
    parentDesc: "Portail parent et surveillance de l'enfant",

    // Features
    createAdminAccounts: "Créer des comptes administrateur",
    setTabPasswords: "Définir les mots de passe des onglets",
    viewAnalytics: "Voir les analyses",
    manageSchoolSettings: "Gérer les paramètres de l'école",
    pedagogyManagement: "Gestion pédagogique",
    financeTracking: "Suivi financier",
    attendanceMonitoring: "Surveillance de la présence",
    assetsManagement: "Gestion des actifs",
    manageStudentGroups: "Gérer les groupes d'étudiants",
    enterGrades: "Saisir les notes",
    markAttendance: "Marquer la présence",
    viewSchedule: "Voir l'horaire",
    viewGrades: "Voir les notes",
    checkSchedule: "Vérifier l'horaire",
    groupInformation: "Informations du groupe",
    communityAccess: "Accès communautaire",
    childProgress: "Progrès de l'enfant",
    paymentTracking: "Suivi des paiements",
    busTracking: "Suivi du bus",
    receiveAlerts: "Recevoir des alertes",

    // Header
    welcomeBack: "Bon retour !",
    thisIsYourDashboard: "ceci est votre tableau de bord.",
    refreshingData: "Actualisation des données...",
    signedInAs: "Connecté en tant que",

    // Sidebar
    managementSystem: "Système de gestion",

      // Admin Management Page
      adminManagementTitle: "Gestion du personnel administratif",
      adminManagementDesc: "Créer et gérer les comptes du personnel administratif",
      addAdmin: "Ajouter un administrateur",
      adminStaffMembers: "Membres du personnel administratif",
      adminStaffMembersDesc: "Liste de tous les membres du personnel ayant un accès administratif.",
      fullName: "Nom complet",
      username: "Nom d'utilisateur",
      email: "E-mail",
      phone: "Téléphone",
      createdAt: "Date de création",
      actions: "Actions",
      loadingAdminData: "Chargement des données des administrateurs...",
      noAdminsFound: "Aucun membre du personnel administratif trouvé.",
      successTitle: "Succès",
      createNewAdmin: "Créer un nouvel administrateur",
      editAdmin: "Modifier l'administrateur",
      createNewAdminDesc: "Remplissez les détails pour créer un nouveau compte du personnel.",
      editAdminDesc: "Mettez à jour les détails du membre sélectionné.",
      leaveBlank: "Laisser vide pour conserver l'actuel",
      phoneNumber: "Numéro de téléphone",
      cancel: "Annuler",
      createAdmin: "Créer un administrateur",
      saveChanges: "Enregistrer les modifications",
      adminCreated: "Compte du personnel administratif créé avec succès !",
      adminUpdated: "Compte du personnel administratif mis à jour avec succès !",
      passwordTooShort: "Le mot de passe est requis et doit contenir au moins 8 caractères.",
      newPasswordTooShort: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      authFailed: "Échec de l'authentification.",
      unknownError: "Une erreur inconnue s'est produite.",

      // Tab Password Manager Page
tabPasswordManagementTitle: "Gestion des mots de passe des onglets",
tabPasswordManagementDesc: "Définir et gérer les mots de passe pour différentes sections administratives",
success: "Succès",
passwordUpdated: "Mot de passe mis à jour avec succès !",
loadingPasswordSettings: "Chargement des paramètres de mot de passe...",
passwordStatus: "Statut du mot de passe",
passwordStatusCount: " rôles administratifs ont un mot de passe défini",
configured: "Configuré",

// Tabs
tabPedagogy: "Pédagogie",
tabPedagogyDesc: "Gérer les étudiants, enseignants, groupes et emplois du temps",
tabFinance: "Finances",
tabFinanceDesc: "Gérer les paiements, salaires et le suivi financier",
tabAttendance: "Présence",
tabAttendanceDesc: "Suivre la présence des employés et des étudiants",
tabAssets: "Biens",
tabAssetsDesc: "Gérer le matériel et l'inventaire de l'école",

// Status
set: "Défini",
notSet: "Non défini",

// Buttons
updatePassword: "Mettre à jour le mot de passe",
setPassword: "Définir le mot de passe",

// Important
importantLabel: "Important :",
importantNotice: "Ces mots de passe seront requis pour que le personnel accède à leurs sections respectives. Partagez-les en toute sécurité.",

// Dialog
setPasswordFor: "Définir le mot de passe pour {name}",
updatePasswordFor: "Mettre à jour le mot de passe pour {name}",
createPasswordDesc: "Créez un mot de passe sécurisé pour cette section administrative.",
updatePasswordDesc: "Mettez à jour le mot de passe pour cette section administrative.",
newPassword: "Nouveau mot de passe",
confirmPassword: "Confirmer le mot de passe",
enterPasswordPlaceholder: "Entrez un mot de passe (min. 6 caractères)",
confirmPasswordPlaceholder: "Confirmez le nouveau mot de passe",

// Errors
passwordCannotBeEmpty: "Le mot de passe ne peut pas être vide",
passwordTooShort4: "Le mot de passe doit contenir au moins 4 caractères",
passwordsNotMatch: "Les mots de passe ne correspondent pas",
authTokenNotFound: "Jeton d'authentification introuvable.",
couldNotLoadStatuses: "Impossible de charger les statuts des mots de passe depuis le serveur.",


// Analytics Dashboard Page
financialSummary: "Résumé financier",
financialSummaryDesc: "Un résumé de l’activité financière depuis le début.",
totalIncome: "Revenus totaux",
totalExpenses: "Dépenses totales",
netProfit: "Bénéfice net",
goToFinanceDashboard: "Aller au tableau de bord financier pour plus de détails",

academicPerformanceTitle: "Performance académique par groupe",
academicPerformanceDesc: "Moyennes et nombre d'étudiants pour chaque groupe académique.",
level: "Niveau",
speciality: "Spécialité",
studentCount: "Nombre d'étudiants",
averageGrade: "Moyenne",
gradeOutOf: "/ 20",

schoolVitals: "Indicateurs de l'école",
activeGroups: "Groupes actifs",
unassignedStudents: "Étudiants non assignés",

attendanceLast30Days: "Présence (30 derniers jours)",
workerAttendance: "Présence des employés",
studentAbsenceHotspots: "Points chauds d'absence des étudiants",
absences: "absences",

topTeachers: "Meilleurs enseignants",
topTeachersDesc: "Par nombre de groupes assignés",
groups: "Groupes",


// Add Asset Page
addAsset: "Ajouter un actif",
addNewAssets: "Ajouter de nouveaux actifs",
addAssetsDesc: "Remplissez les détails ci-dessous pour ajouter des actifs à l’inventaire de l’école.",
adding: "Ajout en cours...",
addAssetSingle: "Ajouter un actif",
addAssetMultiple: "Ajouter {quantity} actifs",

essentialInfo: "Informations essentielles",
essentialInfoDesc: "Détails requis pour chaque actif",
assetName: "Nom de l’actif *",
assetNamePlaceholder: "ex: PC de bureau, Chaise d’étudiant",
category: "Catégorie *",
selectCategory: "Sélectionnez une catégorie",
location: "Emplacement *",
selectLocation: "Sélectionnez un emplacement",
quantity: "Quantité *",
ownership: "Propriété *",
ownershipSchool: "Appartenant à l’école",
ownershipLeased: "Loué",
ownershipDonated: "Donné",
ownershipBorrowed: "Emprunté",

multipleAssetsLabel: "Actifs multiples :",
multipleAssetsDesc: "{quantity} éléments seront créés avec des noms incrémentés (ex : {name} #1).",

optionalDetails: "Détails optionnels",
optionalDetailsDesc: "Informations supplémentaires pour un meilleur suivi",
serialNumber: "Numéro de série",
serialNumberPlaceholder: "ex: SN00123AD",
purchaseDate: "Date d’achat",
purchasePrice: "Prix d’achat (par unité) (DZD)",
totalCost: "Coût total : {amount} DZD",
description: "Description / Notes",
descriptionPlaceholder: "ex: Modèle i5, 8GB RAM, 256GB SSD",

toastSuccess: "Ajout de {quantity} actif(s) réussi !",
failedAddAsset: "Échec de l’ajout de l’actif. Veuillez réessayer.",


assetCategories: "Catégories d’actifs",
assetCategoriesDesc: "Parcourez les actifs organisés par catégorie de A à Z",
searchCategoriesAssets: "Rechercher des catégories ou des actifs...",

items: "éléments",
totalValue: "Valeur totale :",
activeLabel: "Actifs:",
schoolOwnedLabel: "Appartenant à l’école:",
recentItems: "Éléments récents :",
moreItems: " éléments de plus",

noCategories: "Aucune catégorie trouvée",
noAssetsYet: "Aucun actif n’a encore été ajouté",
tryAdjustSearch: "Essayez d’ajuster vos critères de recherche",

categoryAssets: "Actifs {category}",
categorySummary: " éléments • Valeur totale :  DZD",

summaryActive: "Actifs",
summaryGoodCondition: "En bon état",
summaryNeedAttention: "Nécessitent une attention",
summarySchoolOwned: "Appartenant à l’école",

value: "Valeur :",
assignedTo: "Attribué à :",
serial: "Numéro de série :",

conditionExcellent: "Excellent",
conditionGood: "Bon",
conditionFair: "Moyen",
conditionPoor: "Mauvais",
conditionNeedsRepair: "À réparer",

statusActive: "Actif",
statusInactive: "Inactif",
statusMaintenance: "En maintenance",
statusDisposed: "Mis au rebut",

totalAssets: "Actifs totaux",
activeAssets: " actifs en service",
depreciation: "Amortissement : ",
maintenanceAlerts: "Alertes de maintenance",
overdueTasks: "Tâches en retard",

assetConditionDistribution: "Répartition de l’état des actifs",

recentActivities: "Activités récentes",
maintenanceCompleted: "Maintenance terminée pour ",
newAssetAdded: "Nouvel actif ajouté : ",
completed: "Terminé",
added: "Ajouté",
noRecentActivities: "Aucune activité récente",



    // ===== Page Paramètres des Actifs =====
    settingsSaved: "Paramètres enregistrés avec succès !",

    generalSettings: "Paramètres généraux",
    generalSettingsDesc: "Configurer les préférences globales de gestion des actifs",
    defaultDepRate: "Taux d'amortissement par défaut (%)",
    annualDepRateHint: "Taux d'amortissement annuel pour les nouveaux actifs",
    maintenanceReminder: "Rappel de maintenance (jours)",
    maintenanceReminderHint: "Jours avant la maintenance pour afficher les alertes",
    lowValueThreshold: "Seuil de faible valeur ($)",
    lowValueThresholdHint: "Les actifs en dessous de ce seuil sont considérés comme de faible valeur",
    defaultMaintenanceInterval: "Intervalle de maintenance par défaut (mois)",
    defaultMaintenanceIntervalHint: "Temps par défaut entre les maintenances planifiées",

    autoUpdateValues: "Mise à jour automatique des valeurs d'actifs",
    autoUpdateValuesDesc: "Calculer automatiquement les valeurs amorties",
    maintenanceAlertsDesc: "Afficher des notifications pour la maintenance à venir",
    lowValueTracking: "Suivi des actifs de faible valeur",
    lowValueTrackingDesc: "Inclure les actifs sous le seuil dans le suivi",
    barcodeScanning: "Activer la lecture de codes-barres",
    barcodeScanningDesc: "Utiliser des codes-barres/QR pour identifier les actifs",
    assetTransfers: "Activer le transfert d'actifs",
    assetTransfersDesc: "Permettre le déplacement des actifs entre emplacements",
    disposalApproval: "Approbation requise pour la mise au rebut",
    disposalApprovalDesc: "Les actifs doivent être approuvés avant mise au rebut",
    saveSettings: "Enregistrer les paramètres",

    addCategory: "Ajouter une catégorie",
    active: "Actif",
    inactive: "Inactif",
    depRate: "Taux d'amortissement :",
    annually: "annuel",
    maintenanceInterval: "Intervalle de maintenance :",
    months: "mois",
    deactivate: "Désactiver",
    activate: "Activer",
    addCategoriesHint: "Ajoutez des catégories pour organiser vos actifs",

    dataManagement: "Gestion des données",
    dataManagementDesc: "Importer, exporter et sauvegarder vos données d'actifs",
    exportData: "Exporter les données",
    importData: "Importer les données",
    dataNotice: "Avis de gestion des données",
    dataNoticeDesc:
      "L'importation de données remplacera les enregistrements existants. Assurez-vous d'exporter vos données actuelles comme sauvegarde avant d'importer.",

    addAssetCategory: "Ajouter une catégorie d'actifs",
    addAssetCategoryDesc: "Créer une nouvelle catégorie pour organiser les actifs",
    categoryName: "Nom de la catégorie *",
    categoryDescription: "Description",
    depRatePercent: "Taux d'amortissement (%)",
    maintenanceIntervalMonths: "Intervalle de maintenance (mois)",
    placeholderCategoryName: "ex : Équipements sportifs",
    placeholderCategoryDesc: "Brève description de cette catégorie...",

    editAssetCategory: "Modifier la catégorie d'actifs",
    editAssetCategoryDesc: "Mettre à jour les informations de la catégorie",

    alertEnterCategoryName: "Veuillez saisir un nom de catégorie",
    alertDeleteCategoryConfirm:
      "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.",
    alertImportSuccess: "Données importées avec succès !",
    alertImportError: "Erreur lors de l'importation des données. Veuillez vérifier le format du fichier.",

    maintenanceAlerts1: "Activer les alertes de maintenance",
    maintenanceAlertsDesc1: "Afficher les notifications pour la maintenance à venir",
    assetCategoriesDesc1: "Gérer les catégories d'actifs et leurs paramètres par défaut",
    noCategories1: "Aucune catégorie configurée",



    inventory_title: "Inventaire des actifs",
    inventory_description: "Gérer, filtrer et suivre les actifs de l'école.",
    refresh: "Actualiser",
    add_asset: "Ajouter un actif",
    search_assets: "Rechercher des actifs...",
    all_categories: "Toutes les catégories",
    all_conditions: "Tous les états",
    all_statuses: "Tous les statuts",
    no_assets_found: "Aucun actif trouvé.",
    try_adjusting_filters: "Essayez d'ajuster vos filtres.",
    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",
    confirm_delete_asset: "Êtes-vous sûr de vouloir supprimer cet actif ?",
    asset_details_category: "Catégorie",
    asset_details_location: "Emplacement",
    asset_details_serial: "Numéro de série",
    asset_details_purchase_date: "Date d'achat",
    asset_details_purchase_price: "Prix d'achat",
    asset_details_ownership: "Propriété",
    add_new_asset: "Ajouter un nouvel actif",
    edit_asset: "Modifier l'actif",
    asset_name: "Nom",
    asset_category: "Catégorie",
    asset_location: "Emplacement",
    asset_serial_number: "Numéro de série",
    asset_purchase_date: "Date d'achat",
    asset_purchase_price: "Prix d'achat",
    asset_condition: "État",
    asset_status: "Statut",
    asset_ownership: "Propriété",
    ownership_school_owned: "Appartenant à l'école",
    ownership_leased: "Loué",
    ownership_donated: "Donné",
    ownership_borrowed: "Emprunté",
    condition_excellent: "Excellent",
    condition_good: "Bon",
    condition_fair: "Moyen",
    condition_poor: "Mauvais",
    condition_needs_repair: "À réparer",
    status_active: "Actif",
    status_inactive: "Inactif",
    status_maintenance: "Maintenance",
    status_disposed: "Mis au rebut",
    save: "Enregistrer",


    maint_title: "Suivi de Maintenance",
    maint_desc: "Planifiez, suivez et gérez toutes les tâches de maintenance des actifs.",
    maint_new_btn: "Nouvelle Maintenance",
    maint_filters_status: "Filtrer par Statut",
    maint_filters_type: "Filtrer par Type",
    maint_filters_priority: "Filtrer par Priorité",
    maint_no_records: "Aucun enregistrement de maintenance trouvé.",

    maint_status_all: "Tous les statuts",
    maint_status_scheduled: "Planifiée",
    maint_status_inprogress: "En cours",
    maint_status_completed: "Terminée",
    maint_status_overdue: "En retard",

    maint_type_all: "Tous les types",
    maint_type_routine: "Routinière",
    maint_type_repair: "Réparation",
    maint_type_inspection: "Inspection",

    maint_priority_all: "Toutes les priorités",
    maint_priority_low: "Faible",
    maint_priority_medium: "Moyenne",
    maint_priority_high: "Élevée",
    maint_priority_urgent: "Urgente",

    maint_schedule_title: "Planifier la Maintenance",
    maint_edit_title: "Modifier la Maintenance",
    maint_asset_label: "Actif",
    maint_asset_placeholder: "Sélectionner un actif...",
    maint_date_label: "Date prévue",
    maint_type_label: "Type",
    maint_type_placeholder: "Sélectionner le type",
    maint_priority_label: "Priorité",
    maint_priority_placeholder: "Sélectionner la priorité",
    maint_description_label: "Description",
    maint_description_placeholder: "Décrivez la tâche de maintenance...",

    maint_btn_cancel: "Annuler",
    maint_btn_save: "Enregistrer",
    maint_btn_edit: "Modifier",
    maint_btn_delete: "Supprimer",



    search_assets_title: "Recherche d'Actifs",
    search_assets_desc: "Recherchez et filtrez les actifs avec des critères avancés",
    search_assets_placeholder: "Rechercher par nom, catégorie, lieu, numéro de série, fabricant, modèle ou notes...",
    search_assets_filters_btn: "Filtres",
    search_assets_export_btn: "Exporter",

    search_assets_adv_filters: "Filtres Avancés",
    search_assets_clear_all: "Tout Effacer",

    search_assets_category_label: "Catégorie",
    search_assets_condition_label: "État",
    search_assets_status_label: "Statut",
    search_assets_location_label: "Lieu",
    search_assets_price_label: "Plage de prix",
    search_assets_date_label: "Date d'achat",
    search_assets_assigned_label: "Attribué à",

    search_assets_category_all: "Toutes les catégories",
    search_assets_condition_all: "Tous les états",
    search_assets_status_all: "Tous les statuts",
    search_assets_location_all: "Tous les lieux",
    search_assets_price_all: "Tous les prix",
    search_assets_date_all: "Toutes les dates",

    search_assets_condition_excellent: "Excellent",
    search_assets_condition_good: "Bon",
    search_assets_condition_fair: "Moyen",
    search_assets_condition_poor: "Mauvais",
    search_assets_condition_needsrepair: "À réparer",

    search_assets_status_active: "Actif",
    search_assets_status_inactive: "Inactif",
    search_assets_status_maintenance: "En maintenance",
    search_assets_status_disposed: "Mis au rebut",

    search_assets_price_under100: "Moins de 100 $",
    search_assets_price_100_500: "100 $ - 500 $",
    search_assets_price_500_1000: "500 $ - 1 000 $",
    search_assets_price_1000_5000: "1 000 $ - 5 000 $",
    search_assets_price_over5000: "Plus de 5 000 $",

    search_assets_date_lastmonth: "Le mois dernier",
    search_assets_date_last3months: "3 derniers mois",
    search_assets_date_last6months: "6 derniers mois",
    search_assets_date_lastyear: "L'année dernière",
    search_assets_date_overyear: "Plus d'un an",

    search_assets_results_found: " trouvés",
    search_assets_results_found_asset: "actif",
    search_assets_results_value: "Valeur totale : ",

    search_assets_no_results_title: "Aucun actif trouvé",
    search_assets_no_results_empty: "Aucun actif n'a encore été ajouté à l'inventaire",
    search_assets_no_results_try: "Essayez d'ajuster vos critères ou filtres",
    search_assets_clear_btn: "Effacer recherche et filtres",

    search_assets_details_title: "Détails de l'Actif",
    search_assets_details_desc: "Informations complètes sur cet actif",

    search_assets_details_name: "Nom de l'actif",
    search_assets_details_category: "Catégorie",
    search_assets_details_condition: "État",
    search_assets_details_status: "Statut",
    search_assets_details_location: "Lieu",
    search_assets_details_assigned: "Attribué à",
    search_assets_details_purchase_date: "Date d'achat",
    search_assets_details_purchase_price: "Prix d'achat",
    search_assets_details_current_value: "Valeur actuelle",
    search_assets_details_serial: "Numéro de série",
    search_assets_details_manufacturer: "Fabricant",
    search_assets_details_model: "Modèle",
    search_assets_details_warranty: "Garantie",
    search_assets_details_last_maintenance: "Dernière maintenance",
    search_assets_details_next_maintenance: "Prochaine maintenance",
    search_assets_details_notes: "Notes",
    search_assets_details_purchased: "Acheter:",




    attendance_overview_title: "Aperçu de la présence",
    attendance_overview_desc: "Voir les statistiques de présence pour une journée spécifique.",

    attendance_select_date: "Sélectionner la date",
    attendance_department_label: "Département",
    attendance_all_departments: "Tous les départements",
    attendance_export_btn: "Exporter",
    attendance_exporting_btn: "Exportation...",

    attendance_loading: "Chargement des statistiques...",

    attendance_daily_stats: "Statistiques quotidiennes",
    attendance_stat_total: "Total",
    attendance_stat_present: "Présent",
    attendance_stat_absent: "Absent",
    attendance_stat_late: "En retard",
    attendance_stat_justified: "Justifié",
    attendance_stat_holiday_rest: "Vacances/Repos",
    attendance_stat_unmarked: "Non marqué",

    attendance_department_breakdown: "Répartition par département",
    attendance_department_rate: "Taux",
    attendance_no_department_data: "Aucune donnée de département",

    attendance_records_day: "Enregistrements du jour",
    attendance_no_records: "Aucun enregistrement trouvé",
    attendance_unmarked_member: "Membre sans nom",

    attendance_status_present: "Présent",
    attendance_status_absent: "Absent",
    attendance_status_late: "En retard",
    attendance_status_justified: "Absence justifiée",
    attendance_status_holiday: "Vacances",
    attendance_status_rest: "Jour de repos",
    attendance_status_unknown: "Inconnu",

    attendance_pdf_title: "Rapport de présence",
    attendance_pdf_date: "Date",
    attendance_pdf_department: "Département",
    attendance_pdf_generated: "Généré le",
    attendance_pdf_headers_name: "Nom",
    attendance_pdf_headers_department: "Département",
    attendance_pdf_headers_role: "Rôle",
    attendance_pdf_headers_status: "Statut",
    attendance_pdf_headers_time: "Heure",
    attendance_pdf_headers_remarks: "Remarques",
    attendance_pdf_no_data: "Aucune donnée du personnel à exporter.",




    tracking_daily_progress_title: "Progrès quotidien",
    tracking_daily_progress_desc: "Résumé des membres du personnel filtrés.",

    tracking_total_staff: "Personnel total",
    tracking_marked: "Marqués",
    tracking_unmarked: "Non marqués",
    tracking_completion: "Achèvement",

    tracking_attendance_title: "Suivi de la présence",
    tracking_attendance_desc: "Sélectionnez une date pour marquer ou modifier les enregistrements de présence.",
    tracking_select_date: "Sélectionner la date",
    tracking_search_staff: "Rechercher du personnel",
    tracking_search_placeholder: "Rechercher par nom...",
    tracking_department: "Département",
    tracking_all_departments: "Tous les départements",
    tracking_filter_placeholder: "Filtrer...",

    tracking_save_btn: "Enregistrer les modifications",
    tracking_saving_btn: "Enregistrement...",

    tracking_staff_list: "Liste du personnel",
    tracking_loading_records: "Chargement des enregistrements pour ",

    tracking_status_label: "Statut",
    tracking_showing_time: "Heure affichée :",

    tracking_no_staff_found: "Aucun membre du personnel trouvé",
    tracking_no_staff_filter: "Aucun membre du personnel ne correspond aux critères de filtrage.",

    tracking_status_present: "Présent",
    tracking_status_absent: "Absent",
    tracking_status_late: "En retard",
    tracking_status_justified: "Justifié",
    tracking_status_holiday: "Vacances",
    tracking_status_rest: "Jour de repos",
    tracking_status_not_marked: "Non marqué",
    tracking_status_unknown: "Inconnu",

    tracking_auth_missing: "Jeton d'authentification introuvable.",
    tracking_fetch_error: "Impossible de charger la présence pour cette date.",
    tracking_save_success: "Présence enregistrée avec succès !",
    tracking_save_error: "Échec de l'enregistrement des modifications. Veuillez réessayer.",

    back_to_staff_roles: "Retour aux rôles du personnel",
    retry: "Réessayer",
    error: "Erreur",
    loading_asset_data: "Chargement des données des actifs...",
    loading_staff_members: "Chargement des membres du personnel...",
    loading_finance_data: "Chargement des données financières...",


    loading_overview: "Chargement des données...",
    error_loading_dashboard: "Erreur de chargement des données:",
    coming_soon: "À venir",
    this_section_is_under_construction: "Cette section est en construction.",



    parent_account: "Compte parent",
    children: "Enfants",
    active_account: "Compte actif",
    children_overview: "Aperçu des enfants",
    quick_overview_of_your_children_academic_performance: "Aperçu rapide de l'éducation des enfants",
    overall_grade: "Note globale",
    absences_lates: "Absences / Retards",
    view_full_details: "Voir les détails complets",
    overall_average: "Note globale",
    lates: "Retards",
    teachers: "Enseignants",
    full_report_for: "Rapport complet pour",
    academic_marks: "Notes académiques",
    trimester: "Trimestre",
    coefficient: "Coefficient",
    dev1: "Dev1",
    dev2: "Dev2",
    exam: "Examen",
    weekly_schedule: "Horaire hebdomadaire",
    attendance_details: "Détails de présence",
    no_absences_or_lates_recorded: "Aucune absence ou retard enregistré.",



    request_a_meeting: "Demander un rendez-vous",
    select_teacher: "Sélectionner le professeur",
    academic_performance: "Performance académique",
    behavioral_issues: "Problèmes de comportement",
    attendance_issues: "Absences / Retards",
    health_and_wellbeing: "Santé et bien-être",
    administrative_request: "Demande administrative",
    extracurricular_activities: "Activités extra-scolaires",
    general_follow_up: "Suivi général",
    conflict_resolution: "Résolution de conflits",
    date: "Date",
    notes: "Notes",
    send_request: "Envoyer la demande",
    your_meetings: "Vos rendez-vous",
    cause: "Cause",
    requested: "Requis",
    scheduled: "Programmé",
    confirm_new_date: "Confirmer la nouvelle date",
    decline_reschedule: "Refuser le report",
    no_meetings_found: "Aucun rendez-vous trouvé.",
    optional: "Optionnel",
    refreshing_data: "Récupération des données...",




    staff_dashboard_title: "Tableau de bord du personnel",
    staff_dashboard_loading: "Chargement du tableau de bord...",

    staff_overview_title: "Aperçu du personnel",
    staff_overview_desc: "Bienvenue dans votre tableau de bord du personnel",
    staff_overview_fullname: "Nom complet",
    staff_overview_role: "Rôle",
    staff_overview_phone: "Téléphone",
    staff_overview_school: "École",

    staff_active_tab_title: "Accès à l’onglet actif",
    staff_active_tab_desc: "Un seul onglet protégé peut être déverrouillé à la fois.",
    staff_active_tab_unlocked: " est actuellement déverrouillé.",
    staff_active_tab_none: "Aucun onglet n’est actuellement déverrouillé.",
    staff_active_tab_hint: "Cliquez sur un onglet protégé et entrez le mot de passe pour y accéder.",
    staff_active_tab_go: "Accéder au tableau de bord",
    staff_active_tab_revoke: "Révoquer l’accès",

    staff_tab_access_granted_title: "Accès  accordé",
    staff_tab_access_granted_desc: "Vous pouvez maintenant accéder à",
    section:"la section",
    staff_tab_access_btn_go: "Accéder au ",
    staff_tab_access_btn_revoke: "Révoquer l’accès",

    staff_tab_locked_message: "Cette section nécessite un mot de passe pour être déverrouillée.",
    staff_tab_password_placeholder: "Entrer le mot de passe",
    staff_tab_password_error: "Mot de passe incorrect.",
    staff_tab_password_failed: "Échec de la vérification du mot de passe",
    staff_tab_btn_unlock: "Déverrouiller",
    staff_tab_btn_verifying: "Vérification...",
    staff_tab_manage_tasks: "Gérer",
    staff_tab_related_tasks: "les tâches liées",





    staffrole_back_btn: "Retour à la sélection du rôle",
    staffrole_header_title: "Administration du personnel",
    staffrole_header_subtitle: "Sélectionnez votre rôle administratif pour continuer",

    staffrole_password_status_title: "État de la protection par mot de passe",
    staffrole_password_status_count_prefix: "de",
    staffrole_password_status_count_suffix: " rôles ont un mot de passe configuré",
    staffrole_password_status_missing: "Contactez le directeur pour configurer les mots de passe manquants",

    staffrole_pedagogy_desc: "Gestion des étudiants et enseignants",
    staffrole_pedagogy_feature1: "Créer des comptes étudiants",
    staffrole_pedagogy_feature2: "Générer des emplois du temps et des groupes",
    staffrole_pedagogy_feature3: "Créer des comptes enseignants",
    staffrole_pedagogy_feature4: "Lier des comptes parents",

    staffrole_finance_desc: "Suivi et gestion financière",
    staffrole_finance_feature1: "Suivi financier du personnel",
    staffrole_finance_feature2: "Revenus et dépenses de l'école",
    staffrole_finance_feature3: "Ajouter du personnel à la base de données",
    staffrole_finance_feature4: "Suivre les paiements des étudiants",

    staffrole_attendance_desc: "Suivi de la présence du personnel",
    staffrole_attendance_feature1: "Suivre la présence des employés",
    staffrole_attendance_feature2: "Marquage manuel de la présence",
    staffrole_attendance_feature3: "Rapports de présence",
    staffrole_attendance_feature4: "Gestion des absences",

    staffrole_assets_desc: "Équipement et inventaire scolaire",
    staffrole_assets_feature1: "Inventaire du matériel",
    staffrole_assets_feature2: "Suivi des actifs",
    staffrole_assets_feature3: "Registres de maintenance",
    staffrole_assets_feature4: "Gestion des achats",

    staffrole_protected: "Protégé",
    staffrole_no_password: "Aucun mot de passe",

    staffrole_btn_access_prefix: "Accéder au",
    staffrole_btn_access_suffix: "tableau de bord",
    staffrole_btn_password_required: "Mot de passe requis",

    staffrole_footer_question: "Vous n'avez pas accès à un rôle ?",
    staffrole_footer_contact: "Contactez le directeur",

    staffrole_dialog_title_prefix: "Entrez le",
    staffrole_dialog_title_suffix: "mot de passe",
    staffrole_dialog_desc: "Cette section est protégée par un mot de passe. Veuillez entrer le mot de passe fourni par le directeur.",
    staffrole_dialog_password_label: "Mot de passe",
    staffrole_dialog_password_placeholder: "Entrez le mot de passe",
    staffrole_dialog_error_notset: "Mot de passe non défini pour ce rôle. Veuillez contacter le directeur.",
    staffrole_dialog_error_required: "Veuillez entrer un mot de passe",
    staffrole_dialog_error_incorrect: "Mot de passe incorrect. Veuillez réessayer.",

    staffrole_dialog_btn_cancel: "Annuler",
    staffrole_dialog_btn_access: "Accéder au tableau de bord",
    staffrole_dialog_btn_verifying: "Vérification...",
    real_time_school_data: "Données scolaires en temps réel",




    studentcomm_feed_title: "Fil de la communauté",
    studentcomm_feed_subtitle: "Consultez les publications et participez aux discussions.",

    studentcomm_btn_refresh: "Rafraîchir",
    studentcomm_sorting_prefix: "tri par :",
    studentcomm_sort_newest: "le plus récent",
    studentcomm_sort_oldest: "le plus ancien",

    studentcomm_filter_placeholder: "Filtrer par enseignant",
    studentcomm_filter_all: "Tous les enseignants",

    studentcomm_error_title: "⚠ Erreur lors du chargement des publications",
    studentcomm_error_msg_prefix: "Une erreur est survenue :",
    studentcomm_error_btn: "Réessayer",

    studentcomm_noposts_title: "Aucune publication trouvée",
    studentcomm_noposts_desc: "Revenez plus tard pour des mises à jour !",

    studentcomm_post_by_prefix: "Par",
    studentcomm_post_attachments: "Pièces jointes",
    studentcomm_post_view_replies_prefix: "Voir",
    studentcomm_post_view_replies_suffix: "réponses",

    studentcomm_reply_you: "Vous",
    studentcomm_reply_teacher: "Enseignant",
    studentcomm_reply_student: "Étudiant",
    studentcomm_reply_author: "Auteur",
    studentcomm_reply_with_files: "cette réponse contient des pièces jointes visibles uniquement par l'auteur",

    studentcomm_reply_placeholder_enabled: "Écrire une réponse...",
    studentcomm_reply_placeholder_disabled:
      "Les réponses ne sont pas disponibles pour ce post. L'auteur a peut-être désactivé les réponses ou limité la publication à certains groupes.",

    studentcomm_replyfile_remove: "Supprimer le fichier",






    studentdash_loading: "Chargement des données de l'étudiant...",
    studentdash_error_title: "Impossible de charger les données",
    studentdash_error_msg_prefix: "Erreur :",

    studentdash_sidebar_overview: "Aperçu",
    studentdash_sidebar_grades: "Mes notes",
    studentdash_sidebar_schedule: "Emploi du temps",
    studentdash_sidebar_group: "Mon groupe",
    studentdash_sidebar_community: "Communauté",
    studentdash_sidebar_profile: "Profil",
    studentdash_header: "Tableau de bord étudiant",

    studentdash_overview_grade: "Moyenne générale",
    studentdash_overview_attendance: "Présence",
    studentdash_overview_subjects: "Matières",
    studentdash_overview_recentgrades: "Notes récentes",
    studentdash_overview_nogrades: "Aucune note enregistrée pour le premier trimestre.",
    studentdash_overview_todaysschedule: "Emploi du temps d'aujourd'hui",
    studentdash_overview_noschedule: "Aucun cours prévu pour aujourd'hui.",

    studentdash_grades_title: "Performance académique",
    studentdash_grades_subtitle: "Vos notes pour l'année scolaire en cours.",
    studentdash_grades_trimester_prefix: "Trimestre",
    studentdash_grades_trimester_performance_prefix: "Performance du trimestre",
    studentdash_grades_average: "Moyenne",
    studentdash_grades_coeff: "Coefficient",
    studentdash_grades_finalgrade: "Note finale",
    studentdash_grades_obs: "Observation",
    studentdash_grades_dev1: "Devoir 1",
    studentdash_grades_dev2: "Devoir 2",
    studentdash_grades_exam: "Examen",

    studentdash_schedule_title: "Emploi du temps hebdomadaire",
    studentdash_schedule_subtitle: "Votre emploi du temps pour cette semaine",

    studentdash_group_title: "Mon groupe de classe",
    studentdash_group_subtitle: "Informations sur votre groupe et vos enseignants",
    studentdash_group_level: "Niveau",
    studentdash_group_season: "Saison",
    studentdash_group_yourteachers: "Vos enseignants",
    studentdash_group_subject: "Matière",

    studentdash_profile_title: "Profil étudiant",
    studentdash_profile_subtitle: "Vos informations personnelles et académiques.",
    studentdash_profile_personalinfo: "Informations personnelles",
    studentdash_profile_academicinfo: "Informations académiques",
    studentdash_profile_parentinfo: "Informations des parents",

    studentdash_profile_fullname: "Nom complet",
    studentdash_profile_email: "Adresse e-mail",
    studentdash_profile_phone: "Numéro de téléphone",
    studentdash_profile_birthdate: "Date de naissance",
    studentdash_profile_birthcity: "Ville de naissance",
    studentdash_profile_nationality: "Nationalité",
    studentdash_profile_schooltype: "Type d'école",
    studentdash_profile_currentgroup: "Groupe actuel",
    studentdash_profile_level: "Niveau",
    studentdash_profile_speciality: "Spécialité",

    studentdash_parent_mother: "Informations de la mère",
    studentdash_parent_father: "Informations du père",
    studentdash_parent_notavail_mother: "Informations de la mère non disponibles.",
    studentdash_parent_notavail_father: "Informations du père non disponibles.",
    Coeff: "Coefficient",





    BTN_CREATE_POST: "Créer un post",
    DIALOG_CREATE_TITLE: "Créer un nouveau post",
    DIALOG_CREATE_DESC: "Partagez une mise à jour avec vos étudiants. Ajoutez des fichiers et sélectionnez des groupes à notifier.",
    INPUT_POST_TITLE: "Titre du post",
    INPUT_POST_CONTENT: "À quoi pensez-vous ?",
    LABEL_VISIBLE_GROUPS: "Visible pour les groupes",
    LABEL_ATTACH_FILES: "Joindre des fichiers",
    UPLOAD_CLICK: "Cliquez pour télécharger",
    BTN_POST: "Publier",
    BTN_POSTING: "Publication...",
  
    POST_EDIT: "Modifier",
    POST_EDIT_TITLE: "Modifier le post",
    POST_EDIT_DESC: "Mettez à jour le titre, le contenu ou les groupes visibles pour ce post.",
    POST_EDIT_FIELD_TITLE: "Titre",
    POST_EDIT_FIELD_CONTENT: "Contenu",
    POST_EDIT_VISIBLE_GROUPS: "Visible pour les groupes",
    POST_EDIT_CANCEL: "Annuler",
    POST_EDIT_SAVE: "Enregistrer les modifications",
    POST_EDIT_SAVING: "Enregistrement...",
  
    POST_BY: "Par",
    POST_SELECTED_GROUPS: "Groupes sélectionnés :",
    POST_ATTACHMENTS: "Pièces jointes",
    POST_VIEW_REPLIES: "Voir ",
    POST_VIEW_REPLIES_COUNT: "réponses",
    POST_REPLY_PLACEHOLDER: "Écrire une réponse...",
    POST_REPLY_YOU: "Vous",
    POST_REPLY_TEACHER: "Enseignant",
    POST_REPLY_STUDENT: "Étudiant",
    POST_REPLY_AUTHOR: "Auteur",
    POST_REPLY_DOWNLOAD_TITLE: "cliquer pour télécharger",
  
    FEED_TITLE: "Flux de la communauté",
    FEED_DESC: "Discussions, questions et annonces.",
    FEED_REFRESH: "Rafraîchir",
    FEED_ERROR_TITLE: "⚠ Erreur lors du chargement",
    FEED_ERROR_DESC: "Un problème est survenu lors du chargement des posts.",
    FEED_TRY_AGAIN: "Réessayer",
    FEED_NO_POSTS_TITLE: "Aucun post trouvé",
    FEED_NO_POSTS_DESC: "Essayez de changer les filtres ou créez un nouveau post !",
    FEED_BTN_ALL: "Tous les posts",
    FEED_BTN_MINE: "Mes posts",
    FEED_SORT_NEWEST: "Trier : Plus récents",
    FEED_SORT_OLDEST: "Trier : Plus anciens",




    teacher_dashboard_title: "Tableau de bord Enseignant",
    teacher_dashboard_refresh: "Rafraîchir",
    teacher_dashboard_loading: "Chargement du tableau de bord enseignant...",
    teacher_dashboard_failed_title: "Échec du chargement des données",
    teacher_dashboard_failed_login: "Veuillez vous reconnecter",
    teacher_dashboard_refreshing: "Actualisation des données...",

    teacher_overview_tab: "Aperçu",
    teacher_groups_tab: "Mes Groupes",
    teacher_grades_tab: "Notes",
    teacher_attendance_tab: "Présence",
    teacher_schedule_tab: "Emploi du temps",
    teacher_community_tab: "Communauté",
    teacher_meetings_tab: "Réunions",
    teacher_profile_tab: "Profil",

    teacher_total_groups: "Groupes totaux",
    teacher_total_students: "Étudiants totaux",
    teacher_subjects: "Matières",
    teacher_weeks_classes: "Cours de la semaine",
    teacher_todays_classes: "Cours d'aujourd'hui",
    teacher_todays_schedule: "Jour scolaire d'aujourd'hui",
    teacher_no_classes_today: "Aucun cours prévu pour aujourd'hui.",

    teacher_groups_manage: "Gérez vos groupes d'étudiants et vos cours",
    teacher_groups_students_count: "{count} étudiants",
    teacher_groups_view_details: "Voir les détails",

    teacher_grades_manage: "Gestion des notes",
    teacher_grades_description: "Saisir et gérer les notes des étudiants pour vos matières",
    teacher_grades_trimester1: "Trimestre 1",
    teacher_grades_trimester2: "Trimestre 2",
    teacher_grades_trimester3: "Trimestre 3",
    teacher_grades_enter: "Saisir les notes",
    teacher_grades_view_report: "Voir le rapport",

    teacher_attendance_manage: "Gestion de la présence",
    teacher_attendance_description: "Sélectionnez une date pour chaque groupe et marquez la présence des étudiants",
    teacher_attendance_mark: "Marquer la présence",

    teacher_schedule_title: "Mon emploi du temps",
    teacher_schedule_description: "Consulter votre emploi du temps hebdomadaire",

    teacher_profile_refresh: "Rafraîchir",
    teacher_profile_contact_admin: "Vous pouvez toujours contacter l'administration pour mettre à jour votre profil",
    teacher_profile_modules: "Matières",
    teacher_profile_no_modules: "Aucune matière assignée pour l'instant",
    teacher_profile_current_groups: "Groupes actuels",
    teacher_profile_no_groups: "N'enseigne aucun groupe",
    teacher_profile_history: "Historique d'enseignement",

    teacher_groupdetails_title: "Détails du groupe",
    teacher_groupdetails_info: "Informations détaillées sur ce groupe incluant les étudiants, la performance et les statistiques.",
    teacher_groupdetails_students: "Nombre total d'étudiants",
    teacher_groupdetails_subject: "Matière",
    teacher_groupdetails_level: "Niveau",
    teacher_groupdetails_academic_year: "Année académique",
    teacher_groupdetails_statistics: "Statistiques de performance",
    teacher_groupdetails_distribution_excellent: "Excellent (16-20)",
    teacher_groupdetails_distribution_good: "Bon (14-15.99)",
    teacher_groupdetails_distribution_average: "Moyen (10-13.99)",
    teacher_groupdetails_distribution_needs: "À améliorer (<10)",
    teacher_groupdetails_attendance_presence: "Présence",
    teacher_groupdetails_attendance_lateness: "Retards",
    teacher_groupdetails_attendance_absence: "Absence",
    teacher_groupdetails_student_list: "Liste des étudiants",
    teacher_groupdetails_student_list_desc: "Tous les étudiants inscrits dans ce groupe",
    teacher_groupdetails_status_active: "Actif",
    teacher_groupdetails_quick_actions: "Actions rapides",
    teacher_groupdetails_export: "Exporter les données du groupe",

    teacher_modal_grades_title: "Saisir les notes",
    teacher_modal_grades_description: "Saisissez les notes de tous les étudiants de ce groupe. module: ",
    teacher_modal_grades_module: "Chaque étudiant a 4 évaluations plus une note finale.",
    teacher_modal_grades_close: "Fermer",
    teacher_modal_loading: "Chargement...",

    teacher_attendance_modal_title: "Marquer la présence",
    teacher_attendance_modal_description: "Marquez la présence pour la date sélectionnée. Cochez les étudiants présents.",
    teacher_attendance_modal_mark: "Marquer la présence",
    teacher_attendance_modal_error: "Erreur lors de l'envoi des données de présence",
    teacher_attendance_modal_success: "Présences enregistrées avec succès",
    teacher_students: "étudiants",
    teacher_grades_class_average: "Moyenne de la classe",
    teacher_username: "Nom d'utilisateur",
    teacher_national_id: "Numéro national",
    teacher_student_name: "Nom de l'étudiant",
    teacher_constant_observation: "Const. Obs.",
    teacher_modal_grades_loading: "Chargement des détails des notes",
    teacher_modal_grades_description1: "Saisissez les notes de tous les étudiants de ce groupe. Chaque étudiant a 4 évaluations plus une note finale.",
    Loading_Group_Details: "Chargement des détails du groupe",
    teacher_groupdetails_group_name: "Nom du groupe",
    teacher_groupdetails_active_students: "Étudiants actifs",
    teacher_groupdetails_grade_distribution: "Distribution des notes",
    teacher_groupdetails_attendance_overview: "Aperçu de la présence",
    teacher_groupdetails_class: "Classe",
    teacher_session: "Session",
    teacher_select_session: "Sélectionner la session",
    teacher_notes_optional: "Notes (Optionnel)",
    Save_Attendance: "Enregistrer la présence",




    teacher_dash_title: "Tableau de bord Enseignant",
    teacher_active_status: "Actif",

    teacher_total_groups1: "Groupes totaux",
    teacher_total_students1: "Étudiants totaux",
    teacher_subjects1: "Matières",
    teacher_today_classes: "Cours d'aujourd'hui",
    teacher_today_schedule: "Emploi du temps d'aujourd'hui",

    teacher_groups_tab_title: "Mes Groupes",
    teacher_groups_tab_desc: "Gérez vos groupes d'étudiants et vos classes",
    teacher_groups_students_label: "étudiants",
    teacher_groups_view_details1: "Voir les détails",

    teacher_grades_tab_title: "Gestion des notes",
    teacher_grades_tab_desc: "Saisir et gérer les notes des étudiants pour vos matières",
    teacher_grades_class_avg: "Moyenne de la classe :",
    teacher_grades_enter_btn: "Saisir les notes",
    teacher_grades_view_report_btn: "Voir le rapport",

    teacher_attendance_tab_title: "Gestion de la présence",
    teacher_attendance_tab_desc: "Sélectionnez une date pour chaque groupe et marquez la présence des étudiants",
    teacher_attendance_select_date: "Sélectionnez une date pour la présence",
    teacher_attendance_selected_prefix: "Sélectionné :",
    teacher_attendance_selected_suffix: "",
    teacher_attendance_for_date: "Présence pour la date sélectionnée :",
    teacher_attendance_mark_btn: "Marquer la présence",
    teacher_attendance_view_report_btn: "Voir le rapport",
    teacher_attendance_present: "Présent",
    teacher_attendance_absent: "Absent",
    teacher_attendance_late: "En retard",
    teacher_attendance_excused: "Excusé",
    teacher_attendance_notes_label: "Notes (Optionnel)",
    teacher_attendance_notes_placeholder: "Ajoutez des notes sur la présence d'aujourd'hui...",
    teacher_attendance_save_btn: "Enregistrer la présence",

    teacher_schedule_tab_title: "Mon emploi du temps",
    teacher_schedule_tab_desc: "Consultez votre emploi du temps hebdomadaire",

    teacher_community_title: "Communauté scolaire",
    teacher_community_desc: "Connectez-vous avec vos collègues et participez aux discussions scolaires",
    teacher_community_coming: "Fonctionnalités communautaires bientôt disponibles",
    teacher_community_subdesc: "Connectez-vous avec d'autres enseignants, partagez des ressources et participez aux discussions scolaires.",

    teacher_settings_title: "Paramètres Enseignant",
    teacher_settings_desc: "Gérez votre profil et vos préférences",
    teacher_settings_personal_info: "Informations personnelles",
    teacher_settings_professional_info: "Informations professionnelles",
    teacher_settings_account_actions: "Actions du compte",
    teacher_settings_change_password: "Changer le mot de passe",
    teacher_settings_update_profile: "Mettre à jour le profil",
    teacher_settings_contact_admin: "Contactez l'administration pour mettre à jour votre profil ou changer votre mot de passe.",

    teacher_modal_grades_title_prefix: "Saisir les notes -",
    teacher_modal_grades_title_suffix: "",
    teacher_modal_grades_desc: "Saisissez les notes de tous les étudiants de ce groupe. Chaque étudiant a 4 évaluations plus une note finale.",
    teacher_modal_student_name: "Nom de l'étudiant",
    teacher_modal_const_obs: "Observation constante",
    teacher_modal_dev1: "Dev 1",
    teacher_modal_dev2: "Dev 2",
    teacher_modal_exam: "Examen",
    teacher_modal_final_grade: "Note finale",
    teacher_modal_actions: "Actions",
    teacher_modal_cancel: "Annuler",
    teacher_modal_save_all: "Enregistrer toutes les notes",

    teacher_modal_attendance_title_prefix: "Marquer la présence -",
    teacher_modal_attendance_title_suffix: "",
    teacher_modal_attendance_desc: "Marquez la présence pour la date sélectionnée. Cochez les étudiants présents.",
    teacher_modal_attendance_class: "Classe :",
    teacher_modal_attendance_date: "Date :",
    teacher_modal_attendance_subject: "Matière :",
    teacher_modal_attendance_present: "Présent :",
    teacher_modal_attendance_absent: "Absent :",
    teacher_modal_attendance_total: "Total :",
    teacher_modal_attendance_close: "Fermer",

    teacher_modal_report_title_prefix: "Rapport de classe -",
    teacher_modal_report_title_suffix: "",
    teacher_modal_report_desc: "Rapport complet sur les performances et la présence de cette classe.",
    teacher_modal_report_total_students: "Nombre total d'étudiants",
    teacher_modal_report_class_avg: "Moyenne de la classe",
    teacher_modal_report_attendance_rate: "Taux de présence",
    teacher_modal_report_pass_rate: "Taux de réussite",
    teacher_modal_report_distribution: "Répartition des notes",
    teacher_modal_report_student_perf: "Performance individuelle des étudiants",
    teacher_modal_report_close: "Fermer",
    teacher_modal_report_export: "Exporter le rapport",

    teacher_modal_group_title_prefix: "Détails du groupe -",
    teacher_modal_group_title_suffix: "",
    teacher_modal_group_desc: "Informations détaillées sur ce groupe incluant les étudiants, la performance et les statistiques.",
    teacher_modal_group_info: "Informations du groupe",
    teacher_modal_group_students: "Nombre total d'étudiants :",
    teacher_modal_group_subject: "Matière :",
    teacher_modal_group_level: "Niveau :",
    teacher_modal_group_year: "Année académique :",
    teacher_modal_group_active_students: "Étudiants actifs :",
    teacher_modal_group_inactive_students: "Étudiants inactifs :",
    teacher_modal_group_room: "Salle :",
    teacher_modal_group_stats: "Statistiques de performance",
    teacher_modal_group_grade_dist: "Répartition des notes",
    teacher_modal_group_attendance_overview: "Aperçu de la présence",
    teacher_modal_group_student_list: "Liste des étudiants",
    teacher_modal_group_student_list_desc: "Tous les étudiants inscrits dans ce groupe",
    teacher_modal_group_status_active: "Actif",
    teacher_modal_group_quick_actions: "Actions rapides",
    teacher_modal_group_enter_grades: "Saisir les notes",
    teacher_modal_group_mark_attendance: "Marquer la présence",
    teacher_modal_group_view_report: "Voir le rapport",
    teacher_modal_group_close: "Fermer",
    teacher_modal_group_export: "Exporter les données du groupe",
    experience: "Expérience",
    qualification: "Qualification",
    teacher_modal_attendance: "Attendance",
    teacher_modal_group_name: "Nom du groupe",
    teacher_modal_group_distribution_excellent1: "Excellent (95-100%)",
    teacher_modal_group_distribution_good1: "Good (85-94%)",
    teacher_modal_group_distribution_average1: "Average (75-84%)",
    teacher_modal_group_distribution_needs1: "Poor (&lt;75%)",
    Current_Grade: "Niveau Actuelle",









    teacher_meetings_request_title: "Demander une réunion",
    teacher_meetings_select_parent: "Sélectionner un parent",
    teacher_meetings_search_placeholder: "Rechercher un parent ou un enfant...",
    teacher_meetings_choose_parent: "Choisir un parent",

    teacher_meetings_cause_label: "Motif",
    teacher_meetings_select_cause: "Sélectionner le motif",
    teacher_meetings_cause_academic: "Performance académique",
    teacher_meetings_cause_behavioral: "Problèmes de comportement",
    teacher_meetings_cause_attendance: "Problèmes d'assiduité",
    teacher_meetings_cause_health: "Santé et bien-être",
    teacher_meetings_cause_admin: "Demande administrative",
    teacher_meetings_cause_extra: "Activités extrascolaires",
    teacher_meetings_cause_followup: "Suivi général",
    teacher_meetings_cause_conflict: "Résolution de conflit",

    teacher_meetings_date_label: "Date",
    teacher_meetings_notes_label: "Remarques (Optionnel)",
    teacher_meetings_notes_placeholder: "Ajoutez des détails pour la réunion...",
    teacher_meetings_send_request: "Envoyer la demande",

    teacher_meetings_list_title: "Vos réunions",
    teacher_meetings_section_action_required: "Action requise",
    teacher_meetings_section_upcoming: "Réunions à venir",
    teacher_meetings_section_pending: "En attente d'approbation",
    teacher_meetings_section_archived: "Archivé",

    teacher_meetings_with: "Réunion avec :",
    teacher_meetings_by: "Demande de réunion par :",
    teacher_meetings_cause_display: "Motif :",
    teacher_meetings_meeting_on: "Réunion le :",
    teacher_meetings_scheduled: "Planifié :",
    teacher_meetings_notes: "Remarques :",
    teacher_meetings_children: "Enfants :",

    teacher_meetings_btn_accept: "Accepter",
    teacher_meetings_btn_decline: "Refuser",
    teacher_meetings_btn_reschedule: "Replanifier",
    teacher_meetings_btn_confirm_date: "Confirmer la nouvelle date",
    teacher_meetings_btn_decline_date: "Refuser",

    teacher_meetings_empty: "Aucune réunion trouvée.",
    teacher_meetings_group: "Groupe:",




    student_dialog_add_title: "Ajouter un nouvel élève",
    student_dialog_edit_title: "Modifier les informations de l'élève",
    student_dialog_add_desc: "Remplissez le formulaire pour créer un nouveau profil d'élève.",
    student_dialog_edit_desc_prefix: "Modification du profil de",
    student_dialog_edit_desc_suffix: "",

    student_dialog_section_account: "Informations du compte",
    student_dialog_section_personal: "Informations personnelles",

    student_dialog_username: "Nom d'utilisateur",
    student_dialog_full_name: "Nom complet",
    student_dialog_phone: "Numéro de téléphone",
    student_dialog_email: "Email",
    student_dialog_password: "Mot de passe",

    student_dialog_password_placeholder_new: "Entrer le mot de passe",
    student_dialog_password_placeholder_edit: "Laisser vide pour conserver le mot de passe actuel",
    student_dialog_show_password: "Afficher le mot de passe",
    student_dialog_hide_password: "Masquer le mot de passe",

    student_dialog_nationality: "Nationalité",
    student_dialog_birth_city: "Ville de naissance",
    student_dialog_birth_date: "Date de naissance",
    student_dialog_sex: "Sexe",
    student_dialog_select_country: "Sélectionner un pays",
    student_dialog_select_city: "Sélectionner une ville",
    student_dialog_select_sex: "Sélectionner le sexe",
    student_dialog_male: "Homme",
    student_dialog_female: "Femme",

    student_dialog_error: "Une erreur s'est produite lors de l'enregistrement du formulaire.",

    student_dialog_cancel: "Annuler",
    student_dialog_saving: "Enregistrement...",
    student_dialog_update: "Mettre à jour l'élève",
    student_dialog_add: "Ajouter l'élève",
    student_dialog_group_history: "Historique du groupe",





    emp_finance_title: "Finances du personnel",
    emp_finance_subtitle: "Gérez les salaires et suivez les profils financiers de tout le personnel et des enseignants.",

    emp_finance_total_employees: "Employés totaux",
    emp_finance_finance_complete: "Paiement effectué",
    emp_finance_pending_payroll: "Paie en attente",
    emp_finance_estimated_payroll: "Paie mensuelle estimée",

    emp_finance_search_placeholder: "Rechercher par nom ou poste...",
    emp_finance_filter_department: "Filtrer par département",
    emp_finance_filter_status: "Filtrer par statut",
    emp_finance_filter_all_departments: "Tous les départements",
    emp_finance_filter_all_statuses: "Tous les statuts",
    emp_finance_filter_done: "Complété",
    emp_finance_filter_pending: "En attente",
    emp_finance_filter_undone: "Aucun salaire",

    emp_finance_add_staff_btn: "Ajouter un employé",

    emp_finance_no_employee_title: "Aucun employé trouvé",
    emp_finance_no_employee_subtitle: "Essayez d’ajuster vos critères de recherche ou de filtre.",

    emp_finance_dialog_add_title: "Ajouter un nouveau membre du personnel",
    emp_finance_dialog_edit_title: "Modifier le profil financier",
    emp_finance_dialog_add_desc: "Remplissez les détails pour ajouter un nouveau membre du personnel à la paie.",
    emp_finance_dialog_edit_desc: "Mettez à jour les informations financières de cet employé.",

    emp_finance_form_name: "Nom complet",
    emp_finance_form_position: "Poste",
    emp_finance_form_department: "Département",
    emp_finance_form_hire_date: "Date d'embauche",
    emp_finance_form_salary: "Salaire",
    emp_finance_form_bank_account: "Numéro de compte bancaire",
    emp_finance_form_status: "Statut d’emploi",
    emp_finance_form_select_status: "Sélectionner un statut",
    emp_finance_form_status_active: "Actif",
    emp_finance_form_status_inactive: "Inactif",

    emp_finance_btn_cancel: "Annuler",
    emp_finance_btn_save: "Enregistrer les modifications",
    emp_finance_btn_create: "Créer le profil",

    emp_finance_attendance_title: "Rapport de présence des 30 derniers jours",
    emp_finance_attendance_desc_prefix: "Présence enregistrée pendant 30 jours pour",
    emp_finance_attendance_desc_suffix: "",
    emp_finance_attendance_col_date: "Date",
    emp_finance_attendance_col_status: "Statut",
    emp_finance_attendance_col_time: "Heure",
    emp_finance_no_attendance: "Aucun enregistrement de présence pour cet employé.",

    emp_finance_transaction_title: "Historique des transactions",
    emp_finance_transaction_desc_prefix: "Tous les paiements enregistrés pour",
    emp_finance_transaction_desc_suffix: "",
    emp_finance_transaction_col_date: "Date",
    emp_finance_transaction_col_desc: "Description",
    emp_finance_transaction_col_type: "Type",
    emp_finance_transaction_col_amount: "Montant",
    emp_finance_no_transactions: "Aucune transaction valide pour cet employé.",

    emp_finance_payroll_title: "Traitement de la paie",
    emp_finance_payroll_desc_prefix: "Appliquez les taxes et pénalités avant de confirmer le paiement du salaire de",
    emp_finance_payroll_desc_suffix: "",
    emp_finance_payroll_base_salary: "Salaire de base",
    emp_finance_payroll_tax_percent: "Pourcentage de taxe (%)",
    emp_finance_payroll_absence_penalty: "Pénalité d'absence",
    emp_finance_payroll_late_penalty: "Pénalité de retard",
    emp_finance_payroll_final_salary: "Salaire final",
    emp_finance_payroll_confirm_btn: "Confirmer et payer",

    emp_finance_profile_monthly_salary: "Salaire mensuel",
    emp_finance_profile_last_payment: "Dernier paiement",
    emp_finance_profile_absence_report: "Rapport d'absence",
    emp_finance_profile_not_set: "Non défini",
    emp_finance_profile_na: "N/A",

    emp_finance_profile_btn_view: "Voir",
    emp_finance_profile_btn_edit: "Modifier",
    emp_finance_profile_btn_delete: "Supprimer",
    emp_finance_profile_btn_pay_salary: "Payer le salaire",

    emp_finance_status_complete: "Complété",
    emp_finance_status_pending: "En attente",
    emp_finance_status_no_salary: "Aucun salaire",

    emp_finance_attendance_present: "Présent",
    emp_finance_attendance_absent: "Absent",
    emp_finance_attendance_late: "En retard",
    emp_finance_attendance_justified: "Justifié",
    emp_finance_attendance_holiday: "Vacances",
    emp_finance_attendance_rest: "Jour de repos",
    emp_finance_attendance_unknown: "Inconnu",





    fin_dash_title: "Tableau de bord financier",
    fin_dash_subtitle: "Une vue complète de la santé financière de votre établissement.",

    fin_dash_period_label: "Sélectionner la période",
    fin_dash_period_overall: "Général",
    fin_dash_period_select: "Choisir la période",

    fin_dash_stat_net_profit: "Bénéfice net",
    fin_dash_stat_total_income: "Revenus totaux",
    fin_dash_stat_total_expenses: "Dépenses totales",
    fin_dash_stat_profiles: "Profils enregistrés",
    fin_dash_profiles_students: "Étudiants",
    fin_dash_profiles_teachers: "Enseignants",
    fin_dash_profiles_staff: "Personnel / Employés",

    fin_dash_breakdown_title: "Répartition financière",
    fin_dash_breakdown_desc: "Répartition des revenus et des dépenses pour la période sélectionnée.",
    fin_dash_breakdown_income: "Sources de revenus",
    fin_dash_breakdown_expense: "Catégories de dépenses",
    fin_dash_breakdown_no_income: "Aucune donnée de revenus disponible.",
    fin_dash_breakdown_no_expense: "Aucune donnée de dépenses disponible.",

    fin_dash_monthly_title: "Performance mensuelle",
    fin_dash_monthly_desc: "Revenus vs dépenses au cours des derniers mois.",

    fin_dash_transactions_title: "Transactions",
    fin_dash_transactions_desc: "Les 10 dernières transactions de votre établissement",
    fin_dash_transactions_search_placeholder: "Rechercher...",
    fin_dash_transactions_type_placeholder: "Type",
    fin_dash_transactions_filter_all: "Tous",
    fin_dash_transactions_filter_income: "Revenus",
    fin_dash_transactions_filter_expense: "Dépenses",
    fin_dash_transactions_col_details: "Détails",
    fin_dash_transactions_col_amount: "Montant",
    fin_dash_no_transactions_title: "Aucune transaction trouvée.",
    fin_dash_no_transactions_subtitle: "Essayez de modifier vos filtres.",

    fin_dash_no_data_title: "Aucune donnée financière disponible",
    fin_dash_no_data_desc: "Aucune donnée reçue du serveur.",
    fin_dash_loading_msg: "Chargement du tableau de bord financier...",





    fin_set_title: "Paramètres financiers",
    fin_set_subtitle: "Configurer les préférences et valeurs par défaut du système financier",
    fin_set_save_btn: "Enregistrer les paramètres",
    fin_set_save_alert: "Paramètres enregistrés avec succès !",

    fin_set_general_title: "Paramètres généraux",
    fin_set_general_desc: "Configuration de base du système financier",
    fin_set_currency_label: "Devise par défaut",
    fin_set_tax_label: "Taux de taxe (%)",
    fin_set_payroll_label: "Fréquence de paie",
    fin_set_fiscal_label: "Début de l'exercice financier",

    fin_set_student_title: "Paramètres de paiement des étudiants",
    fin_set_student_desc: "Configurer les frais et options de paiement des étudiants",
    fin_set_auto_reminder_label: "Rappels de paiement automatiques",
    fin_set_auto_reminder_desc: "Envoyer des rappels automatiques pour les paiements à venir et en retard",
    fin_set_late_fee_label: "Frais de retard",
    fin_set_late_fee_hint: "Montant facturé pour les paiements en retard ",
    fin_set_grace_label: "Période de grâce (jours)",
    fin_set_grace_hint: "Nombre de jours après l’échéance avant l’application des frais de retard",

    fin_set_system_title: "Informations système",
    fin_set_system_desc: "État et informations actuels du système",
    fin_set_system_storage_label: "Stockage des données",
    fin_set_system_storage_val: "Stockage local du navigateur",
    fin_set_system_updated_label: "Dernière mise à jour",

    fin_set_currency_list_usd: "Dollar américain",
    fin_set_currency_list_eur: "Euro",
    fin_set_currency_list_gbp: "Livre sterling",
    fin_set_currency_list_cad: "Dollar canadien",
    fin_set_currency_list_aud: "Dollar australien",
    fin_set_currency_list_jpy: "Yen japonais",
    fin_set_currency_list_cny: "Yuan chinois",
    fin_set_currency_list_inr: "Roupie indienne",

    fin_set_payroll_weekly: "Hebdomadaire",
    fin_set_payroll_biweekly: "Bi-hebdomadaire",
    fin_set_payroll_monthly: "Mensuel",
    fin_set_payroll_quarterly: "Trimestriel",

    fin_set_fiscal_jan: "Janvier",
    fin_set_fiscal_feb: "Février",
    fin_set_fiscal_mar: "Mars",
    fin_set_fiscal_apr: "Avril",
    fin_set_fiscal_may: "Mai",
    fin_set_fiscal_jun: "Juin",
    fin_set_fiscal_jul: "Juillet",
    fin_set_fiscal_aug: "Août",
    fin_set_fiscal_sep: "Septembre",
    fin_set_fiscal_oct: "Octobre",
    fin_set_fiscal_nov: "Novembre",
    fin_set_fiscal_dec: "Décembre",



    inc_out_total_income: "Revenus totaux",
    inc_out_total_expenses: "Dépenses totales",
    inc_out_net_flow: "Flux net",
    inc_out_search_placeholder: "Rechercher des transactions...",
    inc_out_from_label: "De",
    inc_out_to_label: "À",
    inc_out_add_btn: "Ajouter",
    inc_out_record_title: "Enregistrer une transaction",
    inc_out_select_type_placeholder: "Sélectionner le type",
    inc_out_type_income: "Revenu",
    inc_out_type_expense: "Dépense",
    inc_out_amount_placeholder: "Montant",
    inc_out_description_placeholder: "Description",
    inc_out_save_btn: "Enregistrer",
    inc_out_no_payment_method: "N/A",
    inc_out_transaction_student_fees: "Frais étudiant : ",
    inc_out_transaction_salary: "Salaire : ",




    emp_finance_missing_profiles: "Profils financiers manquants",
    emp_finance_missing_profiles_desc: "Certains étudiants et enseignants n’ont pas encore de profils financiers. Créez-les pour gérer les salaires et les paiements.",
    emp_finance_missing_profiles_desc_suffix: "",
    emp_finance_create_all: "Créer tous",
    emp_finance_all_profiles_created: "Tous les profils créés",
    emp_finance_all_profiles_created_desc: "Chaque étudiant et enseignant a un profil financier.",





    staffdb_title: "Base de données du personnel",
    staffdb_description:
      "Gérez les membres du personnel sans leur attribuer de comptes système. Stockez leurs coordonnées et informations.",
    staffdb_add_btn: "Ajouter un membre du personnel",
    staffdb_add_new_title: "Ajouter un nouveau membre du personnel",
    staffdb_edit_title: "Modifier le membre du personnel",
    staffdb_add_description: "Ajoutez un nouveau membre du personnel à la base de données",
    staffdb_edit_description: "Mettre à jour les informations du membre du personnel",
    staffdb_label_fullname: "Nom complet",
    staffdb_label_position: "Poste",
    staffdb_label_department: "Département",
    staffdb_label_phone: "Numéro de téléphone",
    staffdb_label_email: "Adresse e-mail",
    staffdb_label_address: "Adresse",
    staffdb_label_emergency: "Contact d'urgence",
    staffdb_label_notes: "Remarques",
    staffdb_placeholder_address: "Adresse complète...",
    staffdb_placeholder_emergency: "Nom et numéro de téléphone",
    staffdb_placeholder_notes: "Informations supplémentaires...",
    staffdb_btn_add_member: "Ajouter un membre",
    staffdb_btn_update_member: "Mettre à jour le membre",
    staffdb_btn_cancel: "Annuler",
    staffdb_search_placeholder: "Rechercher des membres du personnel...",
    staffdb_btn_view: "Voir",
    staffdb_btn_edit: "Modifier",
    staffdb_btn_delete: "Supprimer",
    staffdb_delete_confirm: "Êtes-vous sûr de vouloir supprimer ce membre du personnel ?",
    staffdb_no_staff_title: "Aucun membre du personnel trouvé",
    staffdb_no_staff_add_text: "Commencez par ajouter votre premier membre du personnel",
    staffdb_no_staff_search_text: "Aucun membre ne correspond à vos critères de recherche",
    staffdb_add_first_btn: "Ajouter le premier membre",
    staffdb_total_staff: "Personnel total",
    staffdb_total_staff_desc: "Membres du personnel dans la base de données",
    staffdb_departments: "Départements",
    staffdb_departments_desc: "Départements différents",
    staffdb_recent_additions: "Ajouts récents",
    staffdb_recent_additions_desc: "Ajoutés cette semaine",
    staffdb_view_title: "Détails du membre du personnel",
    staffdb_view_description_prefix: "Informations complètes sur",
    staffdb_section_basic: "Informations de base",
    staffdb_section_contact: "Informations de contact",
    staffdb_section_additional: "Remarques supplémentaires",
    staffdb_field_fullname: "Nom complet",
    staffdb_field_position: "Poste",
    staffdb_field_department: "Département",
    staffdb_field_added_date: "Date d’ajout",
    staffdb_field_phone: "Téléphone",
    staffdb_field_email: "E-mail",
    staffdb_field_address: "Adresse",
    staffdb_field_emergency: "Contact d'urgence",
    staffdb_field_notes: "Remarques",
    staffdb_btn_close: "Fermer",
    staffdb_added_label: "Ajouté :",
    staffdb_emergency_label_prefix: "Urgence :",






    stdpay_title: "Paiements des étudiants",
    stdpay_description:
      "Gérez et suivez toutes les transactions financières des étudiants.",
    stdpay_card_students: "Étudiants inscrits",
    stdpay_card_transactions: "Transactions totales",
    stdpay_card_revenue: "Revenu total",
    stdpay_card_average: "Paiement moyen",
    stdpay_filter_placeholder: "Filtrer par statut",
    stdpay_filter_all: "Tous les étudiants",
    stdpay_filter_due: "⚠️ Paiement dû",
    stdpay_filter_never: "Jamais payé",
    stdpay_filter_monthly: "Plan mensuel",
    stdpay_filter_quarterly: "Plan trimestriel",
    stdpay_filter_yearly: "Plan annuel",
    stdpay_search_placeholder: "Rechercher des étudiants par nom...",
    stdpay_status_paid: "Payé",
    stdpay_status_due: "Bientôt dû",
    stdpay_status_overdue: "En retard",
    stdpay_status_never: "Jamais payé",
    stdpay_plan_label: "Plan",
    stdpay_last_payment: "Dernier paiement",
    stdpay_next_due: "Date d’échéance",
    stdpay_btn_record_payment: "Enregistrer le paiement",
    stdpay_btn_view_details: "Voir les détails",
    stdpay_no_students_title: "Aucun étudiant trouvé",
    stdpay_no_students_text:
      "Essayez d’ajuster vos critères de recherche ou de filtrage.",
    stdpay_dialog_record_title: "Enregistrer un nouveau paiement",
    stdpay_dialog_record_for_prefix: "Pour l’étudiant :",
    stdpay_label_amount: "Montant",
    stdpay_label_description: "Description",
    stdpay_label_plan: "Plan",
    stdpay_label_method: "Méthode",
    stdpay_placeholder_amount: "Montant en ",
    stdpay_option_monthly: "Mensuel",
    stdpay_option_quarterly: "Trimestriel",
    stdpay_option_yearly: "Annuel",
    stdpay_option_cash: "Espèces",
    stdpay_option_card: "Carte",
    stdpay_option_bank: "Virement bancaire",
    stdpay_btn_save: "Enregistrer le paiement",
    stdpay_btn_saving: "Enregistrement...",
    stdpay_error_submit: "Échec de l’enregistrement du paiement. Réessayez plus tard.",
    stdpay_dialog_history_title: "Historique des transactions",
    stdpay_dialog_history_prefix: "Tous les paiements enregistrés pour",
    stdpay_table_date: "Date",
    stdpay_table_desc: "Description",
    stdpay_table_plan: "Plan",
    stdpay_table_method: "Méthode",
    stdpay_table_amount: "Montant",
    stdpay_table_no_data: "Aucune transaction trouvée pour cet étudiant.",
    stdpay_total_paid: "Total payé :",





    school_settings_loading: "Chargement des paramètres de l’école...",
    school_settings_loading_text: "Chargement des paramètres de l’école...",
    school_settings_title: "Paramètres généraux de l’école",
    school_settings_description:
      "Gérez les informations de base et la localisation de votre école. Les modifications seront appliquées sur toute la plateforme.",
    school_settings_general_info: "Informations générales",
    school_settings_school_name: "Nom de l’école",
    school_settings_school_type: "Type d’école",
    school_settings_derivation_key: "Clé de dérivation",
    school_settings_location_coords: "Coordonnées de localisation",
    school_settings_latitude: "Latitude (X)",
    school_settings_longitude: "Longitude (Y)",
    school_settings_drag_pin:
      "Vous pouvez également définir l’emplacement en déplaçant l’épingle sur la carte.",
    school_settings_location_map: "Carte de localisation de l’école",
    school_settings_error_auth: "Échec de l’authentification.",
    school_settings_error_unknown: "Une erreur inconnue est survenue.",
    school_settings_error_save: "Échec de l’enregistrement des paramètres.",
    school_settings_success_update:
      "Paramètres de l’école mis à jour avec succès !",
    school_settings_save_changes: "Enregistrer les modifications",






    signup_title: "Commencez avec ",
    signup_title_suffix: "Directis ",
    signup_title_suffix_2: "360",
    signup_subtitle:
      "Rejoignez le réseau croissant d’écoles qui transforment l’éducation en Algérie",
    signup_selected_plan: "Plan sélectionné :",
    signup_selected_plan_placeholder: "Sélectionner un plan",
    signup_plan_includes: "Ce qui est inclus :",
    signup_plan_see_included: "Voir ce qui est inclus",
    signup_school_info_title: "Informations sur l’école",
    signup_school_info_desc:
      "Parlez-nous de votre école et nous vous proposerons le plan idéal",
    signup_fullname_label: "Nom complet",
    signup_fullname_placeholder: "Entrez votre nom complet",
    signup_schoolname_label: "Nom de l’école",
    signup_schoolname_placeholder: "Entrez le nom de votre école",
    signup_email_label: "Adresse e-mail",
    signup_email_placeholder: "ecole@example.com",
    signup_phone_label: "Numéro de téléphone",
    signup_phone_placeholder: "+213 XXX XXX XXX",
    signup_phone_desc: "Nous utiliserons ce numéro pour vous contacter à propos de l’installation",
    signup_submit: "Commencer",
    signup_submitting: "Envoi...",
    signup_success_title: "Merci pour votre intérêt !",
    signup_success_desc:
      "Nous avons bien reçu votre demande d’inscription et nous vous contacterons sous 24 heures pour configurer votre école sur Directis 360.",
    signup_submit_another: "Soumettre une autre demande",
    signup_plan_starter_name: "Démarrage",
    signup_plan_starter_price: "1 500 DZD/élève",
    signup_plan_starter_desc:
      "Parfait pour les petites écoles jusqu’à 100 élèves",
    signup_plan_prof_name: "Professionnel",
    signup_plan_prof_price: "3 000 DZD/mois",
    signup_plan_prof_desc:
      "Idéal pour la plupart des écoles jusqu’à 300 élèves",
    signup_plan_enterprise_name: "Entreprise",
    signup_plan_enterprise_price: "Tarification personnalisée",
    signup_plan_enterprise_desc:
      "Pour les grandes institutions avec un nombre illimité d’élèves",
    signup_plan_feature_1: "Jusqu’à 100 élèves",
    signup_plan_feature_2: "Tableaux de bord de base",
    signup_plan_feature_3: "Gestion des notes",
    signup_plan_feature_4: "Analyses avancées",
    signup_plan_feature_5: "Accès API",
    signup_plan_feature_6: "Support prioritaire",
    signup_plan_popular: "Populaire",
    signup_logo_alt: "Logo Directis",
    signup_plan_more_features: "plus de fonctionnalités",








    gm_title: "Gestion des groupes",
    gm_subtitle_prefix: "Créer et gérer les groupes d’élèves pour ",
    gm_subtitle_suffix: "votre école",
    gm_btn_reload: "Actualiser",
    gm_btn_create_group: "Créer un groupe",
    gm_btn_apply_season: "Appliquer le filtre saisonnier",
    gm_btn_clear: "Effacer",
    gm_btn_cancel: "Annuler",
    gm_btn_create: "Créer le groupe",
    gm_btn_view: "Voir",
    gm_btn_delete: "Supprimer",
    gm_btn_close: "Fermer",
    gm_alert_no_school_type_title: "Type d’école non configuré",
    gm_alert_no_school_type_desc:
      "Veuillez configurer le type d’école dans les paramètres avant de gérer les groupes.",
    gm_no_groups_title: "Aucun groupe trouvé",
    gm_no_groups_desc_start: "Créez votre premier groupe pour commencer",
    gm_no_groups_desc_filter: "Essayez d’ajuster vos filtres",
    gm_no_groups_btn: "Créer le premier groupe",
    gm_filter_title: "Recherche et filtrage",
    gm_search_placeholder: "Rechercher des groupes par nom",
    gm_filter_grade_placeholder: "Filtrer par niveau",
    gm_filter_status_placeholder: "Filtrer par spécialité",
    gm_filter_all_levels: "Tous les niveaux",
    gm_filter_all_specialities: "Toutes les spécialités",
    gm_filter_start_year_placeholder: "Année de début (ex : 2023)",
    gm_filter_end_year_placeholder: "Année de fin (ex : 2026)",
    gm_filter_invalid_range: "Plage invalide",
    gm_filter_currently_showing: "groupes affichés pour la saison :",
    gm_create_title: "Créer un nouveau groupe",
    gm_create_desc_prefix: "Créer un nouveau groupe d’élèves pour ",
    gm_create_desc_suffix: "l’école",
    gm_loading: "Chargement...",
    gm_academic_info: "Informations académiques",
    gm_required_notice:
      "les champs marqués par ",
      gm_required_notice_suffix: "sont obligatoires",
    gm_school_level: "Niveau scolaire",
    gm_configured_by: "(configuré par le directeur)",
    gm_speciality_label: "Spécialité",
    gm_select_speciality_placeholder: "Veuillez sélectionner une spécialité",
    gm_level_label: "Niveau",
    gm_select_level_placeholder: "Sélectionner un niveau",
    gm_select_speciality_first: "(Sélectionnez la spécialité d’abord)",
    gm_room_season_details: "Salle et saison",
    gm_season_label: "Saison",
    gm_select_season_placeholder: "Sélectionner une saison",
    gm_subject_assignment: "Affectation des matières",
    gm_subject_details_format: "{speciality} - {level} {suffix}",
    gm_coef_label: "Coef",
    gm_obligatory: "Obligatoire",
    gm_optional: "Optionnelle",
    gm_no_subjects_message:
      "Veuillez sélectionner une spécialité et un niveau pour voir les matières disponibles",
    gm_error_general:
      "Échec de la création du groupe. Veuillez réessayer.",
    gm_view_title: "Détails du groupe",
    gm_view_desc_prefix: "Informations complètes sur ",
    gm_basic_info: "Informations de base",
    gm_label_group_name: "Nom du groupe",
    gm_label_school_type: "Type d’école",
    gm_label_speciality: "Spécialité",
    gm_label_created_date: "Date de création",
    gm_modules_teachers: "Modules et enseignants",
    gm_teacher_assigned: "Enseignant assigné",
    gm_no_teacher: "Aucun enseignant",
    gm_delete_title: "Supprimer le groupe ?",
    gm_delete_warning:
      "Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action supprimera :",
    gm_delete_list1: "Toutes les inscriptions d’élèves de ce groupe",
    gm_delete_list2: "Toutes les affectations d’enseignants pour ce groupe",
    gm_delete_list3: "Toutes les notes associées à ce groupe",
    gm_delete_irreversible:
      "Cette action ",
    gm_delete_irreversible_desc:"est irréversible.",
    gm_delete_cancel: "Annuler",
    gm_delete_confirm: "Supprimer",
    gm_deleting: "Suppression...",
    gm_label_room: "Salle",
    gm_label_teachers: "Enseignants assignés",
    gm_label_created: "Créé",







    mm_title_loading: "Chargement de toutes les réunions...",
    mm_title_error: "Erreur lors du chargement",
    mm_error_description: "Impossible de récupérer les réunions.",
    mm_retry_btn: "Réessayer",
    mm_no_meetings: "Aucune réunion trouvée.",

    mm_toast_error_load_title: "Erreur de chargement des réunions",
    mm_toast_error_load_desc: "Erreur inconnue lors du chargement des réunions",
    mm_toast_success_action: "Réunion mise à jour avec succès",
    mm_toast_error_action: "Échec du traitement de la réunion",

    mm_confirm_delete: "Êtes-vous sûr de vouloir supprimer définitivement cette réunion ?",

    mm_section_action_required: "Action requise (Nouvelles demandes)",
    mm_section_upcoming: "À venir et planifiées",
    mm_section_reschedule: "En attente de reprogrammation",
    mm_section_archived: "Archivées / Clôturées",

    mm_meeting_with: "Réunion avec",
    mm_requested_on: "Demandée le",
    mm_scheduled: "Planifiée le",
    mm_notes: "Notes",

    mm_btn_approve: "Approuver",
    mm_btn_decline: "Refuser",
    mm_btn_confirm_reschedule: "Confirmer la reprogrammation",
    mm_btn_delete: "Supprimer",

    mm_status_accepted: "Acceptée / Terminée",
    mm_status_declined: "Refusée / Annulée",
    mm_status_inprogress: "En cours / Active",
    mm_status_pending: "En attente d'examen",







        // Tabs
        pm_tab_link_parent: "Lier un parent à un élève",
        pm_tab_create_parent: "Créer un nouveau parent",
    
        // Link tab
        pm_link_title: "Lier les comptes",
        pm_link_description: "Connectez un compte parent existant à un compte élève.",
        pm_select_student_label: "Sélectionner un élève",
        pm_select_student_placeholder: "Choisir un élève...",
        pm_select_parent_label: "Sélectionner un parent",
        pm_select_parent_placeholder: "Choisir un parent...",
        pm_relationship_label: "Lien avec l'élève",
        pm_relationship_placeholder: "Choisir le lien",
        pm_relationship_father: "Père",
        pm_relationship_mother: "Mère",
        pm_error_select_both: "Veuillez sélectionner un parent et un élève.",
        pm_error_auth_failed: "Échec de l'authentification.",
        pm_success_linked: "Parent lié à l'élève avec succès !",
        pm_link_btn: "Lier les comptes",
        pm_link_loading: "Liaison...",
    
        // Create parent tab
        pm_create_title: "Créer un compte parent",
        pm_create_description: "Créez un nouveau compte parent pouvant être lié à un ou plusieurs élèves.",
        pm_label_full_name: "Nom complet",
        pm_label_email: "E-mail",
        pm_label_phone: "Numéro de téléphone",
        pm_label_nid: "Numéro d'identification national",
        pm_label_username: "Nom d'utilisateur",
        pm_label_password: "Mot de passe",
        pm_label_declared_relationship: "Lien déclaré",
        pm_success_create: "Compte parent créé avec succès !",
        pm_error_create: "Échec de la création.",
        pm_btn_create: "Créer le parent",
        pm_btn_loading: "Création...",
    
        // Alerts
        pm_alert_error_title: "Erreur",
        pm_alert_success_title: "Succès",










        po_loading_text: "Chargement des données...",

        po_title: "Vue d’ensemble pédagogique",
        po_description: "Résumé en temps réel des opérations académiques de votre école.",
        po_back_btn: "Retour au tableau de bord principal",
    
        po_total_students: "Total des élèves",
        po_total_teachers: "Total des enseignants",
        po_active_groups: "Groupes actifs",
        po_unassigned_students: "Élèves non assignés",
        po_students_change: " nouveaux au cours des 30 derniers jours",
        po_teachers_change: " avec des affectations",
        po_groups_change_prefix: "Pour la saison ",
        po_unassigned_change: "En attente d’affectation",
    
        po_enrollment_title: "Inscriptions des élèves",
        po_enrollment_description: "Répartition entre les élèves inscrits et non assignés.",
        po_registered_label: "Inscrits",
        po_unassigned_label: "Non assignés",
    
        po_level_title: "Répartition des élèves par niveau",
        po_level_description: "Nombre d'élèves inscrits par niveau académique.",
        po_no_students_group: "Aucun élève n’a encore été assigné à un groupe.",
    
        po_top_teachers_title: "Meilleurs enseignants",
        po_top_teachers_description: "Enseignants avec le plus de groupes assignés.",
        po_no_teachers_group: "Aucun enseignant n’a encore été assigné à des groupes.",
        po_groups_label: " Groupes",
    
        po_recent_title: "Activités récentes",
        po_recent_description: "Dernières actions des 7 derniers jours.",
        po_no_activities: "Aucune activité récente à afficher.",
        po_activity_new_student: "Nouvel élève inscrit : ",
        po_activity_new_teacher: "Nouvel enseignant ajouté : ",
        po_activity_new_group: "Nouveau groupe créé : ",
    
        po_quick_title: "Actions rapides",
        po_quick_description: "Commencez avec les tâches courantes.",
        po_action_add_student_title: "Ajouter un nouvel élève",
        po_action_add_student_desc: "Inscrire un nouveau profil d'élève.",
        po_action_add_teacher_title: "Ajouter un nouvel enseignant",
        po_action_add_teacher_desc: "Enregistrer un nouveau membre du personnel enseignant.",
        po_action_create_group_title: "Créer un nouveau groupe",
        po_action_create_group_desc: "Former une nouvelle classe ou un nouveau groupe d’élèves.",
        po_action_assign_students_title: "Assigner les élèves aux groupes",
        po_action_assign_students_desc: "Gérer l’affectation des élèves aux groupes.",







        ps_title: "Paramètres pédagogiques",
        ps_description: "Configurez les préférences et règles spécifiques au système éducatif algérien",
    
        ps_tab_general: "Général",
        ps_tab_grading: "Notation",
        ps_tab_subjects: "Matières",
        ps_tab_groups: "Groupes",
    
        ps_school_schedule_title: "Paramètres de l’emploi du temps",
        ps_school_schedule_desc: "Configurez les horaires et la structure des cours",
        ps_start_time_label: "Heure de début",
        ps_end_time_label: "Heure de fin",
        ps_class_duration_label: "Durée du cours (minutes)",
        ps_break_duration_label: "Durée de la pause (minutes)",
        ps_max_students_label: "Nombre maximal d’élèves par groupe",
        ps_save_general_btn: "Enregistrer les paramètres généraux",
    
        ps_feature_title: "Paramètres des fonctionnalités",
        ps_feature_desc: "Activer ou désactiver les fonctions pédagogiques",
        ps_parent_notif_label: "Notifications des parents",
        ps_parent_notif_desc: "Envoyer des notifications aux parents concernant les progrès des élèves",
        ps_attendance_label: "Suivi des présences",
        ps_attendance_desc: "Suivre la présence des élèves en classe",
        ps_grade_reports_label: "Bulletins de notes",
        ps_grade_reports_desc: "Générer et distribuer les bulletins de notes",
    
        ps_grading_title: "Configuration du système de notation algérien",
        ps_grading_desc: "Définissez les règles et évaluations selon les standards algériens",
        ps_system_label: "Système de notation",
        ps_system_placeholder: "Choisir un système",
        ps_system_20point: "Système sur 20 points (standard algérien)",
        ps_system_letter: "Notes par lettres (A-F)",
        ps_system_percentage: "Pourcentage",
        ps_system_passfail: "Réussi / Échoué",
        ps_passing_label: "Note de passage",
        ps_passing_placeholder: "ex : 10/20, 60%, C",
        ps_report_frequency_label: "Fréquence des bulletins",
        ps_report_frequency_placeholder: "Choisir la fréquence",
        ps_report_frequency_monthly: "Mensuel",
        ps_report_frequency_quarterly: "Trimestriel",
        ps_report_frequency_semester: "Semestriel",
        ps_report_frequency_annual: "Annuel",
        ps_midterm_label: "Examens de mi-parcours",
        ps_midterm_desc: "Activer les périodes d’examens intermédiaires (Contrôles)",
        ps_final_label: "Examens finaux",
        ps_final_desc: "Activer les périodes d’examens finaux",
        ps_save_grading_btn: "Enregistrer les paramètres de notation",
    
        ps_subjects_title: "Gestion des matières",
        ps_subjects_desc: "Configurer les matières principales et optionnelles du programme algérien",
        ps_core_label: "Matières principales",
        ps_add_core_btn: "Ajouter une matière principale",
        ps_elective_label: "Matières optionnelles",
        ps_add_elective_btn: "Ajouter une matière optionnelle",
        ps_weighting_label: "Pondération des matières (coefficients)",
        ps_weighting_desc: "Activer différents coefficients dans le calcul des moyennes",
        ps_default_weight_label: "Coefficient par défaut",
        ps_available_subjects_label: "Matières disponibles du programme algérien ",
        ps_save_subjects_btn: "Enregistrer les paramètres des matières",
    
        ps_groups_title: "Configuration des groupes",
        ps_groups_desc: "Configurer les règles de création et de gestion des groupes scolaires",
        ps_auto_create_label: "Création automatique des groupes",
        ps_auto_create_desc: "Créer automatiquement des groupes lors de l’inscription d’élèves",
        ps_group_pattern_label: "Modèle de nommage des groupes",
        ps_group_pattern_placeholder: "ex : {grade} - Section {section}",
        ps_group_pattern_hint_prefix: "Utilisez",
        ps_group_pattern_hint_suffix: "comme variables. Exemple : 1AS - Section A",
        ps_mixed_label: "Groupes multi-niveaux",
        ps_mixed_desc: "Permettre aux élèves de différents niveaux d’être dans le même groupe",
        ps_max_groups_label: "Nombre maximal de groupes par enseignant",
        ps_save_groups_btn: "Enregistrer les paramètres des groupes",
    
        ps_alert_status_prefix: "État des paramètres :",
        ps_alert_status_suffix:
          "Tous les paramètres pédagogiques sont configurés pour le système éducatif algérien (Primaire, CEM, Lycée). Les modifications sont enregistrées automatiquement.",
        ps_group_pattern_hint_prefix1: "et",










        sm_title: "Gestion des emplois du temps",
        sm_description_prefix: "Sélectionnez un groupe pour gérer son emploi du temps hebdomadaire pour la saison en cours",
        sm_description_suffix: "Saison",
        sm_select_group_placeholder: "Sélectionner un groupe...",
    
        sm_group_schedule_title_prefix: "Emploi du temps de",
        sm_group_schedule_title_suffix: "",
        sm_level_label: "Niveau",
        sm_specialty_label: "Spécialité",
    
        sm_clear_btn: "Effacer l’emploi du temps",
        sm_save_btn: "Enregistrer l’emploi du temps",
        sm_preview_btn: "Aperçu",
        sm_export_btn: "Exporter en PDF",
        sm_add_class_btn: "Ajouter un cours",
    
        sm_clear_dialog_title: "Êtes-vous sûr ?",
        sm_clear_dialog_description:
          "Cela supprimera définitivement toutes les séances de ce groupe. Cette action est irréversible.",
        sm_clear_dialog_cancel: "Annuler",
        sm_clear_dialog_confirm: "Oui, effacer",
    
        sm_loading_message: "Chargement des données initiales...",
    
        sm_edit_class_title: "Modifier le cours",
        sm_add_class_title: "Ajouter un nouveau cours",
        sm_dialog_desc: "Remplissez les détails de la séance de cours.",
    
        sm_day_label: "Jour",
        sm_day_placeholder: "Sélectionner un jour",
        sm_subject_label: "Matière",
        sm_subject_placeholder: "Sélectionner une matière",
        sm_start_label: "Heure de début",
        sm_start_placeholder: "Heure de début",
        sm_end_label: "Heure de fin",
        sm_end_placeholder: "Heure de fin",
        sm_teacher_label: "Enseignant",
        sm_teacher_placeholder: "Sélectionner un enseignant",
        sm_teacher_placeholder_no_subject: "Sélectionner la matière d’abord",
        sm_room_label: "Salle",
        sm_room_placeholder: "ex : Salle 101, Laboratoire A",
    
        sm_conflict_title: "Conflit d’emploi du temps",
        sm_conflict_desc_group: "Ce créneau horaire est déjà occupé par un autre cours pour ce groupe.",
        sm_conflict_desc_teacher:
          "Cet enseignant est déjà programmé pour une autre classe à cette heure.",
        sm_conflict_desc_room: "Cette salle est déjà réservée pour un autre groupe à cette heure.",
    
        sm_cancel_btn: "Annuler",
        sm_update_btn: "Mettre à jour le cours",
        sm_add_btn: "Ajouter le cours",
    
        sm_preview_title_prefix: "Aperçu de l’emploi du temps :",
        sm_preview_desc: "Une vue en lecture seule de l’emploi du temps hebdomadaire.",
        sm_preview_close_btn: "Fermer",
    
        sm_pdf_title: "Emploi du temps de la classe",
        sm_pdf_group: "Groupe",
        sm_pdf_specialty: "Spécialité",
        sm_pdf_level: "Niveau",
        sm_pdf_season: "Saison",
        sm_pdf_teachers_head: "Enseignants",
        sm_pdf_subjects_head: "Matières",
        sm_pdf_day_head: "Jour",
        sm_pdf_time_head: "Heure",
        sm_clear_dialog_description1: "Cela supprimera cette entrée de classe. Cette action n'est pas enregistrée tant que vous n'avez pas cliqué sur 'Enregistrer l'emploi du temps'.",
        sm_delete_btn: "Supprimer",










        sga_select_group_title: "Sélectionner un groupe",
        sga_select_group_desc: "Choisissez un groupe pour gérer les affectations de la saison actuelle.",
        sga_select_group_placeholder: "Sélectionner un groupe...",
    
        sga_loading_message: "Chargement des données des étudiants et des groupes...",
        sga_error_title: "Erreur",
    
        sga_assigned_members_title: "Membres assignés",
        sga_pending_assignments_title: "Affectations en attente",
        sga_current_members_title: "Membres actuels",
        sga_no_students_msg: "Aucun étudiant n’a encore été assigné à ce groupe.",
    
        sga_available_students_title: "Étudiants disponibles",
        sga_filter_unassigned: "Non assigné",
        sga_filter_registered: "Inscrit",
        sga_filter_group_placeholder: "Filtrer par groupe...",
        sga_filter_all_compatible: "Tous les groupes compatibles",
        sga_search_placeholder: "Rechercher des étudiants...",
        sga_in_label: "Dans :",
        sga_transfer_btn: "Transférer",
        sga_assign_btn: "Assigner",
        sga_save_assignments_btn: "Enregistrer les affectations",
    
        sga_empty_state_title: "Sélectionner un groupe",
        sga_empty_state_desc: "Choisissez un groupe pour commencer l’affectation des étudiants.",
    
        sga_transfer_confirm_title: "Confirmer le transfert de l’étudiant",
        sga_transfer_confirm_specialty_title: "Confirmer le changement de spécialité",
        sga_transfer_confirm_warning_title: "Avertissement : cette action est permanente.",
        sga_transfer_confirm_warning_desc:
          "Vous déplacez un étudiant vers une autre spécialité. Ses notes précédentes seront archivées, et il commencera avec un nouveau dossier.",
        sga_transfer_confirm_desc_prefix: "Procéder au transfert de",
        sga_transfer_confirm_desc_suffix: "vers",
        sga_transfer_failed_title: "Échec du transfert",
        sga_transfer_cancel_btn: "Annuler",
        sga_transfer_confirm_btn: "Confirmer le transfert",
    
        sga_unassign_confirm_title: "Confirmer la désaffectation",
        sga_unassign_warning_title: "Avertissement : les notes de l’étudiant seront archivées.",
        sga_unassign_warning_desc:
          "La désaffectation supprimera l’étudiant du groupe et archivera définitivement ses notes. Cette action est réservée aux retraits.",
        sga_unassign_confirm_desc_prefix: "Êtes-vous sûr de vouloir désaffecter",
        sga_unassign_confirm_desc_suffix: "?",
        sga_unassign_failed_title: "Échec de la désaffectation",
        sga_unassign_cancel_btn: "Annuler",
        sga_unassign_confirm_btn: "Confirmer la désaffectation",
    
        sga_save_confirm_title: "Confirmer les nouvelles affectations",
        sga_save_confirm_desc: "Vérifiez les nouvelles affectations avant d’enregistrer.",
        sga_save_new_assignments_title: "Nouvelles affectations :",
        sga_save_loading_msg: "Enregistrement des modifications...",
        sga_save_success_msg: "Modifications enregistrées avec succès !",
        sga_save_failed_title: "Échec de l’enregistrement",
        sga_save_cancel_btn: "Annuler",
        sga_save_confirm_btn: "Enregistrer",
        sga_save_retry_btn: "Réessayer",
        sga_save_close_btn: "Fermer",
        sga_transfer_confirm_desc_suffix2: "leurs notes actuelles seront déplacées avec eux.",
        sga_transfer_confirm_desc_suffix1: "vers le groupe",
        sga_transfer_confirm_desc_prefix1: "Êtes-vous sûr de vouloir transférer l’étudiant",












        sm_title1: "Gestion des étudiants",
        sm_desc: "Ajouter et gérer les étudiants de",
        sm_reload_btn: "Rafraîchir",
        sm_add_btn1: "Ajouter un étudiant",
    
        sm_search_filter_title: "Recherche et filtre",
        sm_search_placeholder: "Rechercher par nom, identifiant ou e-mail...",
        sm_filter_placeholder: "Filtrer par statut",
        sm_filter_all: "Tous les étudiants",
        sm_filter_registered: "Inscrit",
        sm_filter_not_registered: "Non inscrit",
    
        sm_students_title: "Étudiants",
        sm_students_desc: "Gérer tous les étudiants du système",
        sm_no_students_title: "Aucun étudiant trouvé",
        sm_no_students_desc_has_students: "Essayez d’ajuster vos filtres de recherche",
        sm_no_students_desc_empty: "Ajoutez votre premier étudiant pour commencer",
    
        sm_add_dialog_title: "Ajouter un nouvel étudiant",
        sm_edit_dialog_title: "Modifier un étudiant",
        sm_dialog_desc1: "Remplissez les informations de l’étudiant.",
        sm_account_info_title: "Informations du compte",
        sm_personal_info_title: "Informations personnelles",
        sm_username: "Nom d’utilisateur",
        sm_full_name: "Nom complet",
        sm_phone_number: "Numéro de téléphone",
        sm_email: "E-mail",
        sm_password: "Mot de passe",
        sm_password_placeholder_new: "Entrer le mot de passe",
        sm_password_placeholder_edit: "Laissez vide pour conserver le mot de passe actuel",
        sm_nationality: "Nationalité",
        sm_sex: "Sexe",
        sm_birth_date: "Date de naissance",
        sm_birth_city: "Ville de naissance",
        sm_select_country: "Choisir un pays",
        sm_select_city: "Choisir une ville",
        sm_select_sex: "Choisir le sexe",
        sm_male: "Homme",
        sm_female: "Femme",
        sm_cancel_btn1: "Annuler",
        sm_add_student_btn: "Ajouter l’étudiant",
        sm_update_student_btn: "Mettre à jour l’étudiant",
    
        sm_view_account_info: "Informations du compte :",
        sm_view_personal_info: "Informations personnelles :",
        sm_view_group_history: "Historique des groupes :",
        sm_registered_label: "Inscrit",
        sm_not_registered_label: "Non inscrit",
        sm_speciality_label: "Spécialité",
        sm_close_btn: "Fermer",
    
        sm_registered_status: "Inscrit",
        sm_not_registered_status: "Non inscrit",
        sm_registered_with_group: "Inscrit ({groupName})",
    
        sm_error_auth_expired: "La session d’authentification a expiré. Veuillez actualiser.",
        sm_error_unexpected: "Une erreur inattendue s’est produite.",
        sm_born_prefix: "Né le",
        sm_view_btn: "Voir",
        sm_edit_btn: "Modifier",
        sm_mother_phone_number: "Numéro de téléphone de la mère",
        sm_father_phone_number: "Numéro de téléphone du père",
        sm_years_old: "ans",
















        tm_title: "Gestion des enseignants",
        tm_desc: "Ajouter et gérer le personnel enseignant pour toutes les matières",
        tm_reload_btn: "Rafraîchir",
        tm_add_btn: "Ajouter un enseignant",
    
        tm_school_not_configured_alert_title: "Type d’école non configuré.",
        tm_school_not_configured_alert_desc_1: "Veuillez demander au directeur de configurer le type d’école dans Paramètres → Informations de l’école",
        tm_school_not_configured_alert_desc_2: "avant de gérer les enseignants.",
        tm_school_not_configured_card_title: "Gestion des enseignants indisponible",
        tm_school_not_configured_card_desc: "Le type d’école doit être configuré par le directeur avant d’ajouter ou de gérer des enseignants. Cela garantit que les matières correspondent au niveau scolaire.",
    
        tm_loading_text: "Chargement des données des enseignants...",
    
        tm_school_type_label: "Type d’école :",
        tm_subjects_available_label: "matières disponibles",
    
        tm_search_filter_title: "Recherche et filtre",
        tm_search_placeholder: "Rechercher des enseignants par nom, identifiant, e-mail ou matière...",
        tm_filter_placeholder: "Filtrer par statut",
        tm_filter_all: "Tous les statuts",
        tm_filter_active: "Actif",
        tm_filter_inactive: "Inactif",
        tm_filter_on_leave: "En congé",
    
        tm_teachers_title: "Enseignants",
        tm_teachers_desc: "Gérer tout le personnel enseignant et leurs matières",
        tm_no_teachers_title: "Aucun enseignant trouvé",
        tm_no_teachers_desc_empty: "Ajoutez votre premier enseignant pour commencer",
        tm_no_teachers_desc_has_teachers: "Essayez d’ajuster vos filtres de recherche",
    
        tm_card_id: "ID :",
        tm_card_joined: "Rejoint le :",
        tm_card_modules_label: "Matières",
        tm_card_more_label: "et {count} de plus",
        tm_card_view_btn: "Voir",
        tm_card_edit_btn: "Modifier",
        tm_card_delete_btn: "Supprimer",
    
        tm_dialog_add_title: "Ajouter un nouvel enseignant",
        tm_dialog_edit_title: "Modifier un enseignant",
        tm_dialog_add_desc: "Remplissez ce formulaire pour ajouter un nouvel enseignant à votre école",
        tm_dialog_edit_desc_1: "Mettre à jour les informations de",
        tm_dialog_edit_desc_2: "{teacherName}",
    
        tm_form_basic_info: "Informations de base",
        tm_username: "Nom d’utilisateur",
        tm_full_name: "Nom complet",
        tm_phone_number: "Numéro de téléphone",
        tm_national_id: "Numéro national",
        tm_email: "E-mail",
        tm_password: "Mot de passe",
        tm_password_placeholder_new: "Entrer le mot de passe",
        tm_password_placeholder_edit: "Entrer un nouveau mot de passe (optionnel)",
    
        tm_subjects_selected_label: "Matières sélectionnées",
        tm_subjects_list_label: "Matières disponibles",
        tm_cancel_btn: "Annuler",
        tm_add_teacher_btn: "Ajouter l’enseignant",
        tm_update_teacher_btn: "Mettre à jour l’enseignant",
    
        tm_view_title: "Détails de l’enseignant",
        tm_view_desc_part1: "Informations complètes sur",
        tm_view_desc_part2: "{teacherName}",
        tm_view_assigned_subjects: "Matières attribuées",
        tm_view_basic_info: "Informations de base",
        tm_view_teaching_history: "Historique d’enseignement",
        tm_view_history_assigned: "Affecté à",
        tm_view_history_removed: "Retiré de",
        tm_view_history_no_data: "Aucun historique d’enseignement disponible.",
        tm_close_btn: "Fermer",
    
        tm_error_no_token: "Jeton de session invalide. Veuillez vous reconnecter.",
        tm_error_submit_fail: "Échec de l’enregistrement de l’enseignant.",
        tm_desc_prefix: "Ajouter et gérer le personnel enseignant pour",
        tm_desc_suffix: "niveau",
        tm_card_more_label1: "plus",
        tm_of_total: "de total",
        tm_created_date: "Date de création",













        lp_nav_about: "À propos",
        lp_nav_features: "Fonctionnalités",
        lp_nav_dev_team: "Équipe Dev",
        lp_nav_pricing: "Tarifs",
        lp_dashboard_btn: "Tableau de bord",
    
        lp_about_badge: "🎓 Transformer l’éducation en Algérie",
        lp_about_title_part1: "La plateforme complète pour la",
        lp_about_title_highlight: "gestion scolaire moderne",
        lp_about_title_part2: "",
        lp_about_desc: "Simplifiez la gestion de votre établissement grâce à des tableaux de bord pour les directeurs, enseignants, étudiants et parents.",
        lp_about_get_started: "Commencer",
        lp_about_watch_demo: "Voir la démo",
    
        lp_features_title: "Tout ce dont votre école a besoin",
        lp_features_desc: "Outils complets pour chaque membre de la communauté scolaire",
    
        lp_feature_headmaster_title: "Tableau du directeur",
        lp_feature_headmaster_desc: "Supervision complète de l’école avec analyses, rapports et contrôles administratifs.",
        lp_feature_teacher_title: "Portail enseignant",
        lp_feature_teacher_desc: "Gérez les cours, les notes, les présences et communiquez avec les élèves et les parents.",
        lp_feature_student_title: "Espace étudiant",
        lp_feature_student_desc: "Accédez aux devoirs, notes, emplois du temps et collaborez avec vos camarades.",
        lp_feature_parent_title: "Accès parent",
        lp_feature_parent_desc: "Suivez les progrès et la présence de votre enfant et communiquez avec les enseignants.",
        lp_feature_admin_title: "Panneau d’administration",
        lp_feature_admin_desc: "Administration du système, gestion des utilisateurs et configurations techniques.",
        lp_feature_analytics_title: "Analyses et rapports",
        lp_feature_analytics_desc: "Aperçu complet des performances académiques et des opérations scolaires.",
    
        lp_team_title: "Rencontrez nos développeurs",
        lp_team_desc_prefix: "Développé par :",
        lp_team_member_1_name: "Merad Mohamed Said",
        lp_team_member_1_role: "Développeur Back End",
        lp_team_member_1_bio: "Développeur full-stack avec plus de 4 ans d’expérience",
        lp_team_member_2_name: "Amrane Mohamed Aymen",
        lp_team_member_2_role: "Développeur Front End",
        lp_team_member_2_bio: "Développeur web avec plus de 3 ans d’expérience",
    
        lp_pricing_title: "Tarification simple et transparente",
        lp_pricing_desc: "Choisissez le plan parfait pour votre école — sans frais cachés.",
        lp_pricing_plan_starter: "Débutant",
        lp_pricing_plan_professional: "Professionnel",
        lp_pricing_plan_enterprise: "Entreprise",
        lp_pricing_plan_period: "DZD/élève",
        lp_pricing_plan_popular: "Le plus populaire",
        lp_pricing_plan_get_started: "Commencer",
        lp_pricing_footer_btn: "Commencer",
    
        lp_footer_text_part1: "©",
        lp_footer_text_heart: "❤️",
        lp_footer_text_part2: "Créé avec amour pour l’éducation algérienne.",
    


        adminManagementTitle1: "Gestion des administrateurs",
  adminManagementDesc1: "Gérez les comptes et les autorisations du personnel administratif",

  addAdmin1: "Ajouter un administrateur",

  successTitle1: "Succès",

  adminStaffMembers1: "Personnel administratif",
  adminStaffMembersDesc1: "Gérez tous les membres du personnel administratif",

  actions1: "Actions",
  loadingAdminData1: "Chargement des administrateurs...",
  noAdminsFound1: "Aucun administrateur trouvé",

  createNewAdmin1: "Créer un administrateur",
  editAdmin1: "Modifier l’administrateur",

  createNewAdminDesc1: "Remplissez le formulaire pour créer un nouvel administrateur.",
  editAdminDesc1: "Mettre à jour les informations du membre sélectionné.",

  leaveBlank1: "Laisser vide pour conserver le mot de passe actuel",

  createAdmin1: "Créer",
  saveChanges1: "Enregistrer les modifications",

  phoneNumber1: "Numéro de téléphone",

  authenticationFailed1: "Échec de l’authentification.",
  passwordTooShort1: "Le mot de passe est requis et doit contenir au moins 8 caractères.",
  passwordTooShortEdit1: "Le nouveau mot de passe doit contenir au moins 8 caractères.",

  adminCreatedSuccess1: "Administrateur créé avec succès !",
  adminUpdatedSuccess1: "Administrateur mis à jour avec succès !",

  unknownError1: "Une erreur inconnue s’est produite.",










  tabPwdMgmt_title1: "Gestion des mots de passe des sections",
    tabPwdMgmt_description:
      "Gérez les mots de passe de sécurité pour chaque section administrative.",

    tabPwdMgmt_loading: "Chargement des paramètres de mot de passe...",

    tabPwdMgmt_statusTitle: "Statut des mots de passe",
    tabPwdMgmt_statusSuffix: " sections sécurisées",
    tabPwdMgmt_configuredLabel: "Configuré",

    tabPwdMgmt_tabPedagogy: "Pédagogie",
    tabPwdMgmt_tabFinance: "Finance",
    tabPwdMgmt_tabAttendance: "Présence",
    tabPwdMgmt_tabAssets: "Équipements",

    tabPwdMgmt_descPedagogy:
      "Gérer les étudiants, enseignants, groupes et emplois du temps",
    tabPwdMgmt_descFinance:
      "Gérer les paiements, salaires et le suivi financier",
    tabPwdMgmt_descAttendance:
      "Suivre la présence et l'assiduité des employés",
    tabPwdMgmt_descAssets:
      "Gérer les équipements et l'inventaire de l'école",

    tabPwdMgmt_stateSet: "Défini",
    tabPwdMgmt_stateNotSet: "Non défini",

    tabPwdMgmt_btnSetPassword: "Définir le mot de passe",
    tabPwdMgmt_btnUpdatePassword: "Mettre à jour le mot de passe",
    tabPwdMgmt_btnCancel: "Annuler",
    tabPwdMgmt_btnSave: "Enregistrer",

    tabPwdMgmt_dialogSetTitle: "Définir le mot de passe pour",
    tabPwdMgmt_dialogUpdateTitle: "Mettre à jour le mot de passe pour",
    tabPwdMgmt_dialogCreateDesc:
      "Créer un mot de passe sécurisé pour cette section administrative.",
    tabPwdMgmt_dialogUpdateDesc:
      "Mettre à jour le mot de passe existant pour cette section.",

    tabPwdMgmt_labelNewPassword: "Nouveau mot de passe",
    tabPwdMgmt_labelConfirmPassword: "Confirmer le mot de passe",
    tabPwdMgmt_placeholderPassword: "Saisir le mot de passe",
    tabPwdMgmt_placeholderConfirmPassword: "Confirmer le mot de passe",

    tabPwdMgmt_errorEmpty: "Le mot de passe ne peut pas être vide",
    tabPwdMgmt_errorTooShort:
      "Le mot de passe doit contenir au moins 4 caractères",
    tabPwdMgmt_errorMismatch: "Les mots de passe ne correspondent pas",
    tabPwdMgmt_errorFetchStatus:
      "Impossible de charger les statuts des mots de passe depuis le serveur.",

    tabPwdMgmt_successUpdate: "Mot de passe mis à jour avec succès !",

    tabPwdMgmt_importantLabel: "Important :",
    tabPwdMgmt_importantNotice:
      "Les mots de passe protègent des sections administratives sensibles. Partagez-les uniquement avec le personnel autorisé.",





      assetAdd_btnAddAsset: "Ajouter un équipement",
    assetAdd_btnAdd: "Ajouter un équipement",
    assetAdd_btnAddPlural: "équipements",

    assetAdd_phName: "ex : PC de bureau, chaise d'étudiant",
    assetAdd_phSerial: "ex : SN00123AD",
    assetAdd_phPurchasePrice: "15000.00",
    assetAdd_phDescription: "ex : Modèle i5, 8Go RAM, 256Go SSD",
    assetAdd_phSelectCategory: "Sélectionner une catégorie",
    assetAdd_phSelectLocation: "Sélectionner un emplacement",

    assetAdd_toastSuccessPrefix: "Ajout réussi de",
    assetAdd_toastSuccessSingular: "équipement",
    assetAdd_toastSuccessPlural: "équipements",
    assetAdd_toastErrorFallback:
      "Échec de l'ajout de l'équipement. Veuillez réessayer.",
    assetAdd_errorAuth: "Échec de l'authentification.",

    assetAdd_multiExamplePrefix: "Plusieurs équipements détectés :",
    assetAdd_multiExampleSuffix:
      "éléments seront créés avec une numérotation automatique",

    assetAdd_totalCostSuffix: "DZD",

    assetCatFurniture: "Mobilier scolaire (bureaux, chaises, tableaux)",
    assetCatIT: "Équipement informatique (ordinateurs, imprimantes, projecteurs)",
    assetCatLab: "Matériel de laboratoire (microscopes, verrerie)",
    assetCatSport: "Équipement sportif (ballons, filets, tapis)",
    assetCatAV: "Audiovisuel (TV, caméras, haut-parleurs)",
    assetCatMusic: "Instruments de musique",
    assetCatBooks: "Livres et manuels scolaires",
    assetCatCanteen: "Équipement de cantine / cuisine",
    assetCatMaintenance: "Outils de maintenance",
    assetCatVehicles: "Véhicules de service",
    assetCatSecurity:
      "Équipement de sécurité (extincteurs, trousses de secours)",
    assetCatOther: "Autre",

    assetLocMainOffice: "Bureau principal",
    assetLocTeachersRoom: "Salle des professeurs",
    assetLocComputerRoom: "Salle informatique",
    assetLocLibrary: "Bibliothèque",
    assetLocGym: "Gymnase",
    assetLocScienceLab: "Laboratoire de sciences",
    assetLocArtRoom: "Salle d'art",
    assetLocMusicRoom: "Salle de musique",
    assetLocCanteen: "Cantine",
    assetLocStorage: "Magasin de stockage",
    assetLocMaintenance: "Salle de maintenance",
    assetLocClass101: "Salle de classe 101",
    assetLocClass102: "Salle de classe 102",
    assetLocClass201: "Salle de classe 201",
    assetLocOutdoor: "Extérieur / cour",



  },



}

export const supportedLanguages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
]
