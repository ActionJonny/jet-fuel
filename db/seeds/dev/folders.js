const folderTestData = require('../../../folderTestData');

const createFolders = async (knex, folder) => {
  const folderId = await knex('folders').insert({
    title: folder.title,
    id: folder.id
  }, 'id');

  let linksPromises = folder.links.map(link => {
    return createLink(knex, {
      short_url: link.short_url,
      long_url: link.long_url,
      folder_id: folderId[0],
      visits: link.visits,
      id: link.id
    });
  });

  return Promise.all(linksPromises);
};

const createLink = (knex, link) => {
  return knex('links').insert(link);
};

exports.seed = async (knex) => {
  try {
    await knex('links').del();
    await knex('folders').del();

    let folderPromises = folderTestData.map(folder => {
      return createFolders(knex, folder);
    });

    return Promise.all(folderPromises);
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
  };
};
