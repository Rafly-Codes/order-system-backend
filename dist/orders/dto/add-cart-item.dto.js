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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartItemDto = exports.AddCartItemDto = void 0;
const class_validator_1 = require("class-validator");
class AddCartItemDto {
}
exports.AddCartItemDto = AddCartItemDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Menu ID wajib diisi' }),
    __metadata("design:type", String)
], AddCartItemDto.prototype, "menuId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Qty minimal 1' }),
    __metadata("design:type", Number)
], AddCartItemDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddCartItemDto.prototype, "note", void 0);
class UpdateCartItemDto {
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Qty minimal 0 (0 = hapus item)' }),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCartItemDto.prototype, "note", void 0);
//# sourceMappingURL=add-cart-item.dto.js.map