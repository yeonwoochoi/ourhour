module.exports = {
    route_info: [
        {
            file: './tables/crud_function/user_crud_function/create_user',
            path: '/ourhour/user',
            method: 'createUser',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/read_all_user',
            path: '/ourhour/user',
            method: 'readAllUser',
            type: 'get'
        },
        {
            file: './tables/crud_function/user_crud_function/read_user',
            path: '/ourhour/user/read',
            method: 'readUser',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/read_user_by_id',
            path: '/ourhour/user/id/:id',
            method: 'readUserById',
            type: 'get'
        },
        {
            file: './tables/crud_function/user_crud_function/update_user',
            path: '/ourhour/user',
            method: 'updateUser',
            type: 'put'
        },
        {
            file: './tables/crud_function/user_crud_function/update_user_by_id',
            path: '/ourhour/user/id/:id',
            method: 'updateUserById',
            type: 'put'
        },
        {
            file: './tables/crud_function/user_crud_function/delete_user',
            path: '/ourhour/user/deletion',
            method: 'deleteUser',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/create_schedule_main',
            path: '/ourhour/schedule/main',
            method: 'createScheduleMain',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/read_all_schedule_main',
            path: '/ourhour/schedule/main',
            method: 'readAllScheduleMain',
            type: 'get'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/read_schedule_main',
            path: '/ourhour/schedule/main/read',
            method: 'readScheduleMain',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/read_schedule_main_by_title',
            path: '/ourhour/schedule/main/title/:title',
            method: 'readScheduleMainByTitle',
            type: 'get'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/read_schedule_main_by_user_id',
            path: '/ourhour/schedule/main/id/:id',
            method: 'readScheduleMainByUserId',
            type: 'get'
        },
        /*
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/update_schedule_main',
            path: '/ourhour/schedule/main',
            method: 'updateScheduleMain',
            type: 'put'
        },

         */
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/update_schedule_main_by_user_id',
            path: '/ourhour/schedule/main',
            method: 'updateScheduleMainById',
            type: 'put'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/main/delete_schedule_main',
            path: '/ourhour/schedule/main/deletion',
            method: 'deleteScheduleMain',
            type: 'post'
        },


        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine1/create_schedule_routine1',
            path: '/ourhour/schedule/routine1',
            method: 'createScheduleType1',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine1/read_schedule_routine1_by_user_id',
            path: '/ourhour/schedule/routine1/read',
            method: 'readScheduleRoutine1ByUserId',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine1/delete_schedule_routine1_by_main_index',
            path: '/ourhour/schedule/routine1/deletion',
            method: 'deleteScheduleRoutine1ByMainIndex',
            type: 'post'
        },

        /*
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine1/update_schedule_routine1',
            path: '/ourhour/schedule/routine1',
            method: 'updateScheduleRoutine1',
            type: 'put'
        },
         */
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine2/create_schedule_routine2',
            path: '/ourhour/schedule/routine2',
            method: 'createScheduleType2',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine2/read_schedule_routine2_by_user_id',
            path: '/ourhour/schedule/routine2/read',
            method: 'readScheduleRoutine2ByUserId',
            type: 'post'
        },
        {
            file: './tables/crud_function/schedule_crud_function/schedule/routine2/delete_schedule_routine2_by_main_index',
            path: '/ourhour/schedule/routine2/deletion',
            method: 'deleteScheduleRoutine2ByMainIndex',
            type: 'post'
        },

        {
            file: './tables/crud_function/group_crud_function/create_group',
            path: '/ourhour/group',
            method: 'createGroup',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/read_group',
            path: '/ourhour/group/read',
            method: 'readGroup',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/update_group',
            path: '/ourhour/group',
            method: 'updateGroup',
            type: 'put'
        },
        {
            file: './tables/crud_function/group_crud_function/delete_group',
            path: '/ourhour/group/deletion',
            method: 'deleteGroup',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/create_group_board',
            path: '/ourhour/groupboard',
            method: 'createGroupBoard',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/read_all_group_board',
            path: '/ourhour/groupboard',
            method: 'readAllGroupBoard',
            type: 'get'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/read_group_board_by_author_id',
            path: '/ourhour/groupboard/id/:id',
            method: 'readGroupBoardById',
            type: 'get'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/read_group_board_by_group_title',
            path: '/ourhour/groupboard/title/:title',
            method: 'readGroupBoardByTitle',
            type: 'get'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/read_group_board',
            path: '/ourhour/groupboard/read',
            method: 'readGroupBoard',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/update_group_board',
            path: '/ourhour/groupboard',
            method: 'updateGroupBoard',
            type: 'put'
        },
        {
            file: './tables/crud_function/group_crud_function/group_board/delete_group_board',
            path: '/ourhour/groupboard/deletion',
            method: 'deleteGroupBoard',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/friend/create_friend',
            path: '/ourhour/friend',
            method: 'createFriend',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/friend/auth_friend',
            path: '/ourhour/friend/auth',
            method: 'authFriend',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/friend/read_friend',
            path: '/ourhour/friend/read',
            method: 'readFriend',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/friend/read_auth_friend',
            path: '/ourhour/friend/read/auth',
            method: 'readAuthFriend',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/friend/delete_friend',
            path: '/ourhour/friend/deletion',
            method: 'deleteFriend',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/member/create_member',
            path: '/ourhour/member',
            method: 'createMember',
            type: 'post'
        },
        {
            file: './tables/crud_function/group_crud_function/member/update_member',
            path: '/ourhour/member',
            method: 'updateMember',
            type: 'put'
        },
        {
            file: './tables/crud_function/group_crud_function/member/delete_member',
            path: '/ourhour/member/deletion',
            method: 'deleteMember',
            type: 'post'
        },
        {
            file: './merge_schedule/merge',
            path: '/ourhour/merge',
            method: 'merge',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/login/login',
            path: '/ourhour/login',
            method: 'loginUser',
            type: 'post'
        },
        {
            file: './tables/crud_function/user_crud_function/login/register',
            path: '/ourhour/register',
            method: 'registerUser',
            type: 'post'
        },
    ]
}
