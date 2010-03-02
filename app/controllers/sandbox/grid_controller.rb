class Sandbox::GridController < ApplicationController
  def index
  end

  def get_data
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

  def show
    initial_data
    @sql = get_sql
    @result = ActiveRecord::Base.connection.execute(@sql)
  end

  private
  def initial_data
    @syntax = {}

    select = {}
    from = {}
    join_condition = []
    query_condition = []

    # select
    select['user.id'] = {}
    select['user.name'] = {}
    select['department.name'] = {}
    select['user_1.name'] = {}

    # from alias_name => table_name
    from['user'] = 'users'
    from['department'] = 'departments'
    from['user_1'] = 'users'

    #join
    join_condition << ' and user.department_id = department.id'
    join_condition << ' and department.manager_id = user_1.id'

    @syntax[:select] = select
    @syntax[:from] = from
    @syntax[:join_condition] = join_condition
    @syntax[:query_condition] = query_condition
  end

  def get_sql
    sql = ''
    sql << 'select '
    @syntax[:select].keys.each do |k|
      sql << "#{k},"
    end

    sql = sql.chop
    sql << ' from '
    @syntax[:from].each do |k,v|
      sql << "#{v} as #{k},"
    end

    sql = sql.chop
    sql << ' where 1=1'
    @syntax[:join_condition].each do |c|
      sql << c
    end
    return sql.to_s
  end

end
