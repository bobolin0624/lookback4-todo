import {
  repository
} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Item} from '../models';
import {ItemRepository, TodoRepository} from '../repositories';

export class ItemController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
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
              content: {type: 'string'},
              isCompleted: {type: 'boolean'}
            },
            required: ['todoId', 'content']
          },
        },
      },
    })
    item: Omit<Item, 'id'>,
  ): Promise<Item> {
    const todo = await this.todoRepository.findById(item.todoId)
    if (!todo) {
      throw HttpErrors.NotFound(`Todo not found.`)
    }
    return this.itemRepository.create(item);
  }

  @patch('/items/{id}')
  @response(204, {
    description: 'Item updated successfully.',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          // schema: getModelSchemaRef(Item, {partial: true}),
          schema: {
            type: 'object',
            properties: {
              content: {type: 'string'},
              isCompleted: {type: 'boolean'}
            }
          },
        },
      },
    })
    item: Item,
  ): Promise<void> {
    const itemInDB = await this.itemRepository.findById(id)
    if (!itemInDB) {
      throw HttpErrors.NotFound('Item not found.')
    }

    if (item.isCompleted === true) {
      item.completedAt = new Date().toISOString();
    }
    item.updatedAt = new Date().toISOString();

    console.log(item)

    await this.itemRepository.updateById(id, item);
  }

  @del('/items/{id}')
  @response(204, {
    description: 'Item deleted successfully.',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.itemRepository.deleteById(id);
  }

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
