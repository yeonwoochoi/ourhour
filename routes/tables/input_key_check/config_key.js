module.exports = {
    'user_column' : ['user_index', 'user_name', 'user_gender', 'user_email', 'user_birth', 'user_created_at', 'user_updated_at', 'login_id'],
    'friend_column' : ['friend_index', 'user_index'],
    'login_column' : ['id', 'password', 'index', 'user_name'],
    'schedule_main_column' : ['schedule_index', 'schedule_title', 'schedule_content', 'schedule_created_at', 'schedule_updated_at', 'schedule_importance', 'schedule_access', 'schedule_done', 'user_index'],
    'schedule_routine_column' : ['schedule_index', 'schedule_routine', 'schedule_title', 'schedule_content', 'schedule_importance', 'schedule_access', 'schedule_done', 'user_index', 'schedule_start', 'schedule_end', 'schedule_day', 'schedule_end_date', 'schedule_start_time', 'schedule_end_time'],
    'schedule_type1_column' : ['schedule_index', 'sch_routine_type', 'sch_time1_start', 'sch_time1_end', 'sch_time1_end_date'],
    'schedule_type2_column' : ['schedule_index', 'sch_routine_type', 'sch_time2_start', 'sch_time2_end', 'sch_time2_day', 'sch_time2_start_time', 'sch_time2_end_time'],
    'group_column' : ['gb_index', 'gb_name', 'gb_start', 'gb_end', 'gb_created_at', 'gb_updated_at', 'gb_access' , 'owner_index', 'user_index'],
    'group_column1' : ['gb_index', 'gb_name', 'user_index'],
    'group_column2' : ['gb_name', 'gb_start', 'gb_end', 'gb_created_at', 'gb_updated_at', 'gb_access'],
    'group_board_column' : ['gb_index', 'gb_title', 'gb_content', 'gb_importance', 'gb_created_at', 'gb_updated_at', 'gb_author', 'group_index'],
    'member_column' : ['member_index', 'member_access', 'gb_index', 'user_index'],
    'merge' : ['date', 'user_index']
}
