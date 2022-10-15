import type { Request, Response } from 'express';


export type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type ControllerAsIs = (req: Request, res?: Response) => any;

export type Controller = {
  route: string,
  method: Method,

  controllerAsIs: ControllerAsIs,
};
