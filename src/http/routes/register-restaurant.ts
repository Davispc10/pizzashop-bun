import Elysia, { t } from 'elysia';
import { db } from '../../db/drizzle/connection';
import { users, restaurants } from '../../db/drizzle/schema';

export const registerRestaurant = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body;

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager'
      })
      .returning({ id: users.id });

    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id
    });

    set.status = 'No Content';
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      email: t.String(),
      phone: t.String()
    })
  }
);
