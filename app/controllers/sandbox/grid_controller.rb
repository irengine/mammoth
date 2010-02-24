class Sandbox::GridController < ApplicationController
  def index
  end

  def get_data
    render :text => ""
  end

  def get_column_model
    column_model =
<<CM
{
"metaData": {
"totalProperty": "total",
"root": "records",
"id": "id",
"fields": [
{
"name": "id",
"type": "int"
},
{
"name": "name",
"type": "string"
}
]
},
"success": true,
"total": 50,
"records": [
{
"id": "1",
"name": "AAA"
},
{
"id": "2",
"name": "BBB"
}
],
"columns": [
{
"header": "#",
"dataIndex": "id"
},
{
"header": "User",
"dataIndex": "name"
}
]
}
CM
    render :text => column_model
  end

end
