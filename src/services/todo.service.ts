import {repository} from '@loopback/repository';
import {Item, Todo} from '../models';
import {TodoRepository} from '../repositories';
import {ItemRepository} from '../repositories/item.repository';

export class TodoService {
  constructor(
    @repository(TodoRepository) private todoRepository: TodoRepository,
    @repository(ItemRepository) private itemRepository: ItemRepository,
  ) { }

  async createTodoWithItems(todoData: Todo, itemsData: Item[]): Promise<Todo> {

    console.log(todoData)
    console.log(itemsData)
    console.log(2)

    // 先建立 Todo
    const todo = await this.todoRepository.create(todoData);

    // 為 Todo 建立對應的 Items
    for (const itemData of itemsData) {
      await this.itemRepository.create({
        ...itemData,
        todoId: todo.id,
      });
    }

    return todo;
  }
}
