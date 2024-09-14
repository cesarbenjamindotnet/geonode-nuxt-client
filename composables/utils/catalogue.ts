
// Función para actualizar los query params en la URL cuando se seleccionan nodos
const updateQueryParams = () => {
  const queryParams = {...route.query}
  console.log("updateQueryParams queryParams", queryParams)

  // Obtener los nodos hijos del tipo 'dataset'
  const datasetNode = resourceTreeNodes.find(node => node.value === 'dataset')
  let datasetChildren: any[] = []

  if (datasetNode && datasetNode.children) {
    datasetChildren = datasetNode.children.map(child => child.value)
  }

  let datasetSelected = false

  // Verificar si todos los hijos de 'dataset' están seleccionados
  const datasetTicked = tickedResourceTreeNodes.value.filter(item => datasetChildren.includes(item))
  const allDatasetChildrenSelected = datasetTicked.length === datasetChildren.length

  // Creamos los query params f para cada nodo ticked
  let filters: LocationQueryValue[]
  filters = tickedResourceTreeNodes.value.reduce<LocationQueryValue[]>((acc, item) => {
    if (datasetChildren.includes(item)) {
      datasetSelected = true
      if (!allDatasetChildrenSelected) {
        acc.push(item) // Agregamos cada hijo si no están todos seleccionados
      }
    } else {
      acc.push(item) // Para todos los nodos que no son hijos de dataset
    }
    return acc
  }, [])

  // Si hay al menos un hijo de dataset seleccionado o todos, agregamos 'dataset' si no está ya presente
  if (datasetSelected && !filters.includes('dataset')) {
    filters.push('dataset')
  }

  // Actualizamos el parámetro `f` solo si tiene valores seleccionados
  if (filters.length > 0) {
    queryParams.f = filters
  } else {
    delete queryParams.f
  }

  // Actualizamos el parámetro `q` con el valor del input de búsqueda
  if (search.value) {
    queryParams.q = search.value
  }

  if (!!catalogueStore.categoriesSelected && catalogueStore.categoriesSelected.length > 0) {
    queryParams[`filter{category.identifier.in}`] = catalogueStore.categoriesSelected
  } else {
    delete queryParams[`filter{category.identifier.in}`]
  }

  if (!!catalogueStore.keywordsSelected && catalogueStore.keywordsSelected.length > 0) {
    queryParams[`filter{keywords.slug.in}`] = catalogueStore.keywordsSelected
  } else {
    delete queryParams[`filter{keywords.slug.in}`]
  }

  if (!!catalogueStore.regionsSelected && catalogueStore.regionsSelected.length > 0) {
    queryParams[`filter{regions.code.in}`] = catalogueStore.regionsSelected
  } else {
    delete queryParams[`filter{regions.code.in}`]
  }

  if (!!catalogueStore.ownersSelected && catalogueStore.ownersSelected.length > 0) {
    queryParams[`filter{owner.pk.in}`] = catalogueStore.ownersSelected
  } else {
    delete queryParams[`filter{owner.pk.in}`]
  }

  if (catalogueStore.groupsSelected && catalogueStore.groupsSelected.length > 0) {
    queryParams[`filter{group.in}`] = catalogueStore.groupsSelected
  } else {
    delete queryParams[`filter{group.in}`]
  }

  if (catalogueStore.filterUsingExtent) {
    const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent
    queryParams.extent = `${xmin},${ymin},${xmax},${ymax}`
  } else {
    delete queryParams.extent
  }

  // Navegamos a la URL con los nuevos query params
  router.push({query: queryParams})
}