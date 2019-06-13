import { layout as layoutModule } from ".";

export async function loadBackgroundColor(
  context: LayoutModule.ActionContext,
) {
  const respondData: string = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("red");
    }, 4000);
  });

  layoutModule.mutations.setBackgroundColor(respondData);
}

export function returnBackgroundColor(
  context: LayoutModule.ActionContext,
  color: string,
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(color);
    }, 4000);
  });
}
