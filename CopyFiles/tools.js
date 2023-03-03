const { Op } = require('sequelize');
const { throwError } = require('./tools');

const commonGen = (model) => {
  const MODEL = model;
  const get = async ({ id, populate = null, }) => {
    if (!id) throwError('No id provided', null, 400);
    const data = await MODEL.findOne({
      where: { id },
      include: populate 
    });
    return data;
  }

  const update = async ({ id, ...updatedBody }) => {
    if (!id) throwError('No id provided', null, 400);
    console.log(id,updatedBody);
    const data = await MODEL.update(updatedBody.body, { where: { id } });
    return { message: 'Updated successfully' };
  }

  const remove = async ({ id }) => {
    if (!id) throwError('No id provided', null, 400);
    const data = await MODEL.destroy({ where: { id } });
    return { message: 'Deleted successfully' };
  }

  const create = async ({ ...body }) => {
    const data = await MODEL.create(body);
    return data;
  }

  const getAll = async ({ ...body }) => {
    const { limit = 10, page = 1, sort = { field: 'id', order: 'desc' }, filter = {}, populate = null } = body;

    const offset = (page - 1) * limit;

    const newFilter = {};
    for (let key in filter) {
      if (Array.isArray(filter[key])) {
        filter[key].push("");
        newFilter[key] = {
          [Op.in]: filter[key],
        };
      } else {
        newFilter[key] = filter[key];
      }
    }

    const queryData = {
      where: {
        ...newFilter,
      },
      order: [[sort.field, sort.order]],
      limit: limit,
      offset: offset,
    };
    if (populate) {
      queryData.include = populate;
    }
    const respRA = await MODEL.findAndCountAll(queryData);
    const count = await MODEL.count({
      where: {
        ...newFilter,
      },
    });
    const totalPages = Math.ceil(count / limit);
    let data = JSON.parse(JSON.stringify(respRA));
    data.totalPages = totalPages;
    return data;
  };

  return {
    get,
    update,
    remove,
    create,
    getAll,
  };

}

module.exports = commonGen;