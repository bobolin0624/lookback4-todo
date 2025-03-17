import {inject} from '@loopback/core';
import {
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Item, Todo} from '../models';
import {TodoService} from '../services/todo.service';

export class TodoController {
  constructor(
    @inject('services.TodoService') private todoService: TodoService,
  ) { }

  @post('/todos')
  @response(200, {
    description: 'Create todo successful.',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  // TODO add todo with items
  async createTodoWithItems(
    @requestBody({
      description: 'Create a new Todo with multiple Items',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              todo: {
                type: 'object',
                properties: {
                  title: {type: 'string'},
                  subtitle: {type: 'string', nullable: true},
                  status: {
                    type: 'string',
                    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
                    default: 'ACTIVE',
                  }
                },
                required: ['title'],
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    content: {type: 'string'},
                    isCompleted: {type: 'boolean', default: false, },
                    completedAt: {type: 'string', format: 'date-time', nullable: true}
                  },
                  required: ['content', 'isCompleted'],
                },
              },
            },
          },
          example: {
            todo: {
              title: 'Buy Groceries',
              subtitle: 'For the week',
              status: 'ACTIVE'
            },
            items: [
              {
                content: 'Buy apples',
                isCompleted: false,
              },
              {
                content: 'Buy bread',
                isCompleted: false,
              },
            ],
          },
        },
      },
    })
    body: {todo: Todo; items: Item[]},
  ): Promise<Todo> {
    const {todo, items} = body;

    if (!todo.title) {
      throw new HttpErrors.BadRequest('Todo title is required.');
    }
    return this.todoService.createTodoWithItems(todo, items);
  }

  // @get('/todos')
  // @response(200, {
  //   description: 'Array of Todo model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Todo, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Todo) filter?: Filter<Todo>,
  // ): Promise<Todo[]> {
  //   return this.todoRepository.find(filter);
  // }

  // @patch('/todos')
  // @response(200, {
  //   description: 'Todo PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Todo, {partial: true}),
  //       },
  //     },
  //   })
  //   todo: Todo,
  //   @param.where(Todo) where?: Where<Todo>,
  // ): Promise<Count> {
  //   return this.todoRepository.updateAll(todo, where);
  // }

  // @get('/todos/{id}')
  // @response(200, {
  //   description: 'Todo model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Todo, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>
  // ): Promise<Todo> {
  //   return this.todoRepository.findById(id, filter);
  // }

  // @patch('/todos/{id}')
  // @response(204, {
  //   description: 'Todo PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Todo, {partial: true}),
  //       },
  //     },
  //   })
  //   todo: Todo,
  // ): Promise<void> {
  //   await this.todoRepository.updateById(id, todo);
  // }

  // @put('/todos/{id}')
  // @response(204, {
  //   description: 'Todo PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() todo: Todo,
  // ): Promise<void> {
  //   await this.todoRepository.replaceById(id, todo);
  // }

  // @del('/todos/{id}')
  // @response(204, {
  //   description: 'Todo DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.todoRepository.deleteById(id);
  // }
}
