interface Env {
  FORM_BACKEND: {
    fetch(request: Request): Promise<Response>;
  };
}

interface FunctionContext {
  request: Request;
  env: Env;
}

export const onRequest = async ({ request, env }: FunctionContext) => {
  return env.FORM_BACKEND.fetch(request);
};
