"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_service_1 = require("./menus.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let MenusController = class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }
    findAllCategories() {
        return this.menusService.findAllCategories();
    }
    createCategory(dto) {
        return this.menusService.createCategory(dto);
    }
    deleteCategory(id) {
        return this.menusService.deleteCategory(id);
    }
    findAllMenus(categoryId, available) {
        const availableBool = available === 'true' ? true : available === 'false' ? false : undefined;
        return this.menusService.findAllMenus(categoryId, availableBool);
    }
    findOneMenu(id) {
        return this.menusService.findOneMenu(id);
    }
    createMenu(dto) {
        return this.menusService.createMenu(dto);
    }
    updateMenu(id, dto) {
        return this.menusService.updateMenu(id, dto);
    }
    toggleAvailability(id) {
        return this.menusService.toggleAvailability(id);
    }
    deleteMenu(id) {
        return this.menusService.deleteMenu(id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('menus'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('available')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAllMenus", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOneMenu", null);
__decorate([
    (0, common_1.Post)('menus'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Patch)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "updateMenu", null);
__decorate([
    (0, common_1.Patch)('menus/:id/toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "toggleAvailability", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "deleteMenu", null);
exports.MenusController = MenusController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map