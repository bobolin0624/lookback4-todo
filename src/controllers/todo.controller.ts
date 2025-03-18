import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Item, Todo} from '../models';
import {TodoRepository} from '../repositories';
import {TodoService} from '../services/todo.service';

export class TodoController {
  constructor(
    @inject('services.TodoService') private todoService: TodoService,
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) { }

  @post('/todos')
  @response(200, {
    description: 'Todo created successfully.',
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

  @get('/todos/{id}')
  @response(200, {
    description: 'Get not be deleted todo with items.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: {id, isDeleted: false},
      include: [
        {
          relation: 'items'
        }
      ]
    });
    if (!todo) {
      throw new HttpErrors.NotFound('Todo not found or has been deleted.')
    }
    return todo
  }

  @del('/todos/{id}')
  @response(204, {
    description: 'Todo deleted successfully.',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    // 無此 todo
    if (!todo) {
      throw new HttpErrors.NotFound('Todo not found.');
    }

    todo.status = 'DELETED'
    todo.isDeleted = true
    todo.updatedAt = new Date().toISOString();

    await this.todoRepository.updateById(id, todo);
  }

  @patch('/todos/{id}')
  @response(200, {
    description: 'Todo updated successfully.',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}}
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'Update Todo by todo id.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: {type: 'string'},
              subtitle: {type: 'string', nullable: true},
              status: {
                type: 'string',
                enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
                default: 'INACTIVE',
              },
            },
          },
          example: {
            title: 'Buy Groceries',
            subtitle: 'For the week',
            status: 'INACTIVE'
          },
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    const todoById = await this.todoRepository.findById(id);
    if (!todoById) {
      throw HttpErrors.NotFound('Todo not found.')
    }

    const updateTodo = {
      ...todo,
      updatedAt: new Date().toISOString()
    }

    await this.todoRepository.updateById(id, updateTodo);
  }

  @get('/todos')
  @response(200, {
    description: 'List of Todos',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.string('status') status: string, // filter by status
    @param.query.number('limit') limit: number = 10,
    @param.query.number('offset') offset: number = 0,
  ): Promise<Todo[]> {

    // TODO need to add filter and pagination
    const todos = await this.todoRepository.find({
      where: {isDeleted: false},
      include: [
        {
          relation: 'items'
        }
      ]
    });
    if (todos.length === 0) {
      throw new HttpErrors.NotFound('There is no todos.')
    }
    return todos;
  }
}
