import { Request, Response } from 'express';
import { query } from '../db';

export const moveTaskHandler = async (req: Request, res: Response) => {
  try {
    const { taskId, destinationColumnId, newOrder } = req.body;

    const result = await query(
      'UPDATE tasks SET column_id = $1, "order" = $2 WHERE id = $3 RETURNING *',
      [destinationColumnId, newOrder, taskId]
    );

    return res.status(200).json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error('Error al mover la tarea:', error);
    return res.status(500).json({ error: 'Hubo un error al actualizar la tarea' });
  }
};