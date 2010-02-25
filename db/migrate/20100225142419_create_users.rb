class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.integer :department_id
      t.string :name
      t.integer :age
      t.decimal :salary, :scale => 2

      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
