export const TYPES = {
    //repositories
    AuthRepository: Symbol.for('AuthRepository'),
    InterestsRepository: Symbol.for('InterestsRepository'),
    PointSystemRepository: Symbol.for('PointSystemRepository'),
    AdminRepository: Symbol.for('AdminRepository'),
    PrivilegeRepository: Symbol.for('PrivilegeRepository'),
    UserInterestsRepository: Symbol.for('UserInterestsRepository'),
    UserRepository: Symbol.for('UserRepository'),
    UserItemRepository: Symbol.for('UserItemRepository'),
    SwapRequestRepository: Symbol.for('SwapRequestRepository'),
    AdminPrivilegeRepository: Symbol.for('AdminPrivilegeRepository'),

    //services
    AuthService: Symbol.for('AuthService'),
    UserInterestService: Symbol.for('UserInterestService'),
    UserItemService: Symbol.for('UserItemService'),
    SwapRequestService: Symbol.for('SwapRequestService'),
};