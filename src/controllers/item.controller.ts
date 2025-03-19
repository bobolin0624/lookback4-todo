import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Item} from '../models';
import {ItemRepository} from '../repositories';

export class ItemController {
  constructor(
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
  ) { }

  @post('/items')
  @response(200, {
    description: 'Item created successfully.',
    content: {'application/json': {schema: getModelSchemaRef(Item)}},
  })
  async createItem(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              todoId: {type: 'number'},
              content: {type: 'string'}
            },
            required: ['todoId', 'content']
          },
        },
      },
    })
    item: Omit<Item, 'id'>,
  ): Promise<Item> {
    return this.itemRepository.create(item);
  }

  // @del('/items/{id}')
  // @response(204, {
  //   description: 'Item DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.itemRepository.deleteById(id);
  // }

  // @get('/items')
  // @response(200, {
  //   description: 'Array of Item model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Item, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Item) filter?: Filter<Item>,
  // ): Promise<Item[]> {
  //   return this.itemRepository.find(filter);
  // }

  // @patch('/items')
  // @response(200, {
  //   description: 'Item PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Item, {partial: true}),
  //       },
  //     },
  //   })
  //   item: Item,
  //   @param.where(Item) where?: Where<Item>,
  // ): Promise<Count> {
  //   return this.itemRepository.updateAll(item, where);
  // }

  // @get('/items/{id}')
  // @response(200, {
  //   description: 'Item model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Item, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Item, {exclude: 'where'}) filter?: FilterExcludingWhere<Item>
  // ): Promise<Item> {
  //   return this.itemRepository.findById(id, filter);
  // }

  // @patch('/items/{id}')
  // @response(204, {
  //   description: 'Item PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Item, {partial: true}),
  //       },
  //     },
  //   })
  //   item: Item,
  // ): Promise<void> {
  //   await this.itemRepository.updateById(id, item);
  // }

  // @put('/items/{id}')
  // @response(204, {
  //   description: 'Item PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() item: Item,
  // ): Promise<void> {
  //   await this.itemRepository.replaceById(id, item);
  // }

  // @del('/items/{id}')
  // @response(204, {
  //   description: 'Item DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.itemRepository.deleteById(id);
  // }
}
