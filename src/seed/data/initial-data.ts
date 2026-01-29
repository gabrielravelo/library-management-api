import { Role } from '../../auth/enums/role.enum';

export const INITIAL_DATA = {
    users: [
        {
            email: 'admin@admin.com',
            password: 'AdminPassword123!',
            fullName: 'System Administrator',
            role: Role.ADMIN,
        },
        {
            email: 'librarian@test.com',
            password: 'LibrarianPassword123!',
            fullName: 'Juan Bibliotecario',
            role: Role.LIBRARIAN,
        },
        {
            email: 'user@test.com',
            password: 'UserPassword123!',
            fullName: 'Pedro Lector',
            role: Role.USER,
        },
    ],
    authors: [
        { firstName: 'Gabriel', lastName: 'García Márquez' },
        { firstName: 'Isabel', lastName: 'Allende' },
    ],
};
