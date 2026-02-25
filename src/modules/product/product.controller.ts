import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { CreateSkuDto, UpdateSkuDto } from './dtos/sku.dto';

@ApiTags('product')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // ==================== 前台接口 ====================

  @Public()
  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['price_asc', 'price_desc', 'sales', 'new'] })
  async getProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.productService.getProducts(page || 1, limit || 20, categoryId, keyword, sortBy);
  }

  @Public()
  @Get('recommend')
  @ApiOperation({ summary: '获取推荐商品' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecommendProducts(@Query('limit') limit?: number) {
    return this.productService.getRecommendProducts(limit || 10);
  }

  @Public()
  @Get('hot')
  @ApiOperation({ summary: '获取热销商品' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHotProducts(@Query('limit') limit?: number) {
    return this.productService.getHotProducts(limit || 10);
  }

  @Public()
  @Get('new')
  @ApiOperation({ summary: '获取新品商品' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNewProducts(@Query('limit') limit?: number) {
    return this.productService.getNewProducts(limit || 10);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  async getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Public()
  @Get(':id/skus')
  @ApiOperation({ summary: '获取商品 SKU 列表' })
  async getProductSkus(@Param('id') id: string) {
    return this.productService.getProductSkus(id);
  }

  // ==================== 分类接口 ====================

  @Public()
  @Get('categories/tree')
  @ApiOperation({ summary: '获取分类树' })
  async getCategoryTree() {
    return this.productService.getCategoryTree();
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: '获取分类列表' })
  async getCategories() {
    return this.productService.getCategories();
  }

  @Public()
  @Get('categories/:id')
  @ApiOperation({ summary: '获取分类详情' })
  async getCategory(@Param('id') id: string) {
    return this.productService.getCategory(id);
  }
}

// ==================== 后台管理接口 ====================

@ApiTags('admin/product')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(JwtAuthGuard)
export class AdminProductController {
  constructor(private productService: ProductService) {}

  // 分类管理
  @Post('categories')
  @ApiOperation({ summary: '创建分类（后台）' })
  async createCategory(@Body() createDto: CreateCategoryDto) {
    return this.productService.createCategory(createDto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: '更新分类（后台）' })
  async updateCategory(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.productService.updateCategory(id, updateDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: '删除分类（后台）' })
  async deleteCategory(@Param('id') id: string) {
    return this.productService.deleteCategory(id);
  }

  // 商品管理
  @Post()
  @ApiOperation({ summary: '创建商品（后台）' })
  async createProduct(@Body() createDto: CreateProductDto) {
    return this.productService.createProduct(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商品（后台）' })
  async updateProduct(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商品（后台）' })
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put(':id/publish')
  @ApiOperation({ summary: '上架商品（后台）' })
  async publishProduct(@Param('id') id: string) {
    return this.productService.publishProduct(id);
  }

  @Put(':id/unpublish')
  @ApiOperation({ summary: '下架商品（后台）' })
  async unpublishProduct(@Param('id') id: string) {
    return this.productService.unpublishProduct(id);
  }

  // SKU 管理
  @Post(':id/skus')
  @ApiOperation({ summary: '创建 SKU（后台）' })
  async createSku(@Param('id') id: string, @Body() createDto: CreateSkuDto) {
    return this.productService.createSku(id, createDto);
  }

  @Put('skus/:skuId')
  @ApiOperation({ summary: '更新 SKU（后台）' })
  async updateSku(@Param('skuId') skuId: string, @Body() updateDto: UpdateSkuDto) {
    return this.productService.updateSku(skuId, updateDto);
  }

  @Delete('skus/:skuId')
  @ApiOperation({ summary: '删除 SKU（后台）' })
  async deleteSku(@Param('skuId') skuId: string) {
    return this.productService.deleteSku(skuId);
  }

  @Put('skus/batch-stock')
  @ApiOperation({ summary: '批量更新 SKU 库存（后台）' })
  async batchUpdateSkuStock(@Body() updates: { id: string; stock: number }[]) {
    return this.productService.batchUpdateSkuStock(updates);
  }
}
