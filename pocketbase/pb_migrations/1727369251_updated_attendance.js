/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cnrobb7o68iofrg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tu0pejuf",
    "name": "image",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cnrobb7o68iofrg")

  // remove
  collection.schema.removeField("tu0pejuf")

  return dao.saveCollection(collection)
})
