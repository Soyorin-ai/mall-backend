import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/category.entity';
import { ProductSku } from './entities/sku.entity';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { CreateSkuDto, UpdateSkuDto } from './dtos/sku.dto';

/**
 * 商品服务
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductSku)
    private skuRepository: Repository<ProductSku>,
  ) {}

  // ==================== 分类管理 ====================

  /**
   * 获取分类列表（树形结构）
   */
  async getCategoryTree() {
    const categories = await this.categoryRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC', created_at: 'ASC' },
    });

    // 构建树形结构
    const tree = this.buildCategoryTree(categories, null);
    return tree;
  }

  /**
   * 构建分类树
   */
  private buildCategoryTree(categories: ProductCategory[], parentId: string | null): any[] {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => ({
        ...cat,
        children: this.buildCategoryTree(categories, cat.id),
      }));
  }

  /**
   * 获取分类列表（扁平）
   */
  async getCategories() {
    return this.categoryRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC', created_at: 'ASC' },
    });
  }

  /**
   * 获取分类详情
   */
  async getCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  /**
   * 创建分类（后台）
   */
  async createCategory(createDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(category);
  }

  /**
   * 更新分类（后台）
   */
  async updateCategory(id: string, updateDto: UpdateCategoryDto) {
    const category = await this.getCategory(id);
    await this.categoryRepository.update(id, updateDto);
    return this.getCategory(id);
  }

  /**
   * 删除分类（后台）
   */
  async deleteCategory(id: string) {
    const category = await this.getCategory(id);

    // 检查是否有子分类
    const children = await this.categoryRepository.find({
      where: { parent_id: id },
    });

    if (children.length > 0) {
      throw new Error('该分类下有子分类，无法删除');
    }

    // 检查是否有商品
    const products = await this.productRepository.find({
      where: { category_id: id },
    });

    if (products.length > 0) {
      throw new Error('该分类下有商品，无法删除');
    }

    await this.categoryRepository.remove(category);
    return { message: '删除成功' };
  }

  // ==================== 商品管理 ====================

  /**
   * 获取商品列表（前台）
   */
  async getProducts(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    keyword?: string,
    sortBy?: string,
  ) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // 只查询上架商品
    queryBuilder.where('product.status = :status', { status: 1 });

    // 分类筛选
    if (categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId });
    }

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere('product.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // 排序
    switch (sortBy) {
      case 'price_asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'sales':
        queryBuilder.orderBy('product.sales + product.virtual_sales', 'DESC');
        break;
      case 'new':
        queryBuilder.orderBy('product.created_at', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.sort', 'ASC').addOrderBy('product.created_at', 'DESC');
    }

    // 分页
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取商品详情（前台）
   */
  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id, status: 1 },
      relations: ['category', 'skus'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  /**
   * 获取推荐商品
   */
  async getRecommendProducts(limit: number = 10) {
    return this.productRepository.find({
      where: { status: 1, is_recommend: true },
      order: { sort: 'ASC', created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * 获取热销商品
   */
  async getHotProducts(limit: number = 10) {
    return this.productRepository.find({
      where: { status: 1, is_hot: true },
      order: { sales: 'DESC' },
      take: limit,
    });
  }

  /**
   * 获取新品商品
   */
  async getNewProducts(limit: number = 10) {
    return this.productRepository.find({
      where: { status: 1, is_new: true },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * 创建商品（后台）
   */
  async createProduct(createDto: CreateProductDto) {
    const product = this.productRepository.create(createDto);
    return this.productRepository.save(product);
  }

  /**
   * 更新商品（后台）
   */
  async updateProduct(id: string, updateDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    await this.productRepository.update(id, updateDto);
    return this.productRepository.findOne({ where: { id } });
  }

  /**
   * 删除商品（后台）
   */
  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    await this.productRepository.remove(product);
    return { message: '删除成功' };
  }

  /**
   * 上架商品（后台）
   */
  async publishProduct(id: string) {
    await this.productRepository.update(id, { status: 1 });
    return { message: '上架成功' };
  }

  /**
   * 下架商品（后台）
   */
  async unpublishProduct(id: string) {
    await this.productRepository.update(id, { status: 0 });
    return { message: '下架成功' };
  }

  // ==================== SKU 管理 ====================

  /**
   * 获取商品 SKU 列表
   */
  async getProductSkus(productId: string) {
    return this.skuRepository.find({
      where: { product_id: productId },
      order: { created_at: 'ASC' },
    });
  }

  /**
   * 获取 SKU 详情
   */
  async getSku(id: string) {
    const sku = await this.skuRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!sku) {
      throw new NotFoundException('SKU 不存在');
    }

    return sku;
  }

  /**
   * 创建 SKU（后台）
   */
  async createSku(productId: string, createDto: CreateSkuDto) {
    const sku = this.skuRepository.create({
      ...createDto,
      product_id: productId,
    });
    return this.skuRepository.save(sku);
  }

  /**
   * 更新 SKU（后台）
   */
  async updateSku(id: string, updateDto: UpdateSkuDto) {
    const sku = await this.skuRepository.findOne({ where: { id } });
    if (!sku) {
      throw new NotFoundException('SKU 不存在');
    }

    await this.skuRepository.update(id, updateDto);
    return this.skuRepository.findOne({ where: { id } });
  }

  /**
   * 删除 SKU（后台）
   */
  async deleteSku(id: string) {
    const sku = await this.skuRepository.findOne({ where: { id } });
    if (!sku) {
      throw new NotFoundException('SKU 不存在');
    }

    await this.skuRepository.remove(sku);
    return { message: '删除成功' };
  }

  /**
   * 批量更新 SKU 库存（后台）
   */
  async batchUpdateSkuStock(updates: { id: string; stock: number }[]) {
    for (const update of updates) {
      await this.skuRepository.update(update.id, { stock: update.stock });
    }
    return { message: '更新成功' };
  }
}
