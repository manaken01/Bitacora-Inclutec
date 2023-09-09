import { MatPaginatorIntl } from "@angular/material";

/**
 * Translates all of the paginator properties to spanish
 * @param page
 * @param pageSize
 * @param length
 */
const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

/**
 * Returns a function with all the properties of the paginator translated
 */
export function getSpanishPaginator() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = "Items por página:";
  paginatorIntl.nextPageLabel = "Siguiente página";
  paginatorIntl.previousPageLabel = "Página anterior";
  paginatorIntl.lastPageLabel = "Ultima página";
  paginatorIntl.firstPageLabel = "Primera página";
  paginatorIntl.getRangeLabel = spanishRangeLabel;

  return paginatorIntl;
}
