Ext.override(Ext.ux.form.ItemSelector, {
    fromTo : function() {
        var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i = 0; i < selectionsArray.length; i++) {
                var record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            if (!this.allowDup)selectionsArray = [];
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (this.allowDup) {
                    // find if it exists in toMultiselect
                    var textFieldName = this.toMultiselect.displayField;
                    var valueFieldName = this.toMultiselect.valueField;
                    var text = record.data[textFieldName];
                    var value = record.data[valueFieldName];
                    if (this.toMultiselect.view.store.find(valueFieldName, value) != -1) {
                        var x = new Ext.data.Record();
                        var lastRecord = this.toMultiselect.view.store.query(valueFieldName, value).last().copy();
                        var lastValue = lastRecord.data[valueFieldName];
                        var lastIndex = 1;
                        if (lastValue.lastIndexOf(')') != -1)
                            lastIndex = parseInt(lastValue.substr(lastValue.lastIndexOf('_') + 1, lastValue.length - lastValue.lastIndexOf('_') - 2)) + 1;
                        lastRecord.data[valueFieldName] = value + '(' + value + '_' + lastIndex.toString() + ')';
                        lastRecord.data[textFieldName] = text + '(' + text + '_' + lastIndex.toString() + ')';
                        lastRecord.id = x.id;
                        this.toMultiselect.view.store.add(lastRecord);
                        delete lastRecord;
                        delete x;
                    } else {
                        var x = new Ext.data.Record();
                        record.id = x.id;
                        this.toMultiselect.view.store.add(record);
                        delete x;
                    }
                } else {
                    this.fromMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.add(record);
                    selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.toMultiselect.view.refresh();
        this.fromMultiselect.view.refresh();
        var si = this.toMultiselect.store.sortInfo;
        if (si) {
            this.toMultiselect.store.sort(si.field, si.direction);
        }
        this.toMultiselect.view.select(selectionsArray);
    },

    reset: function() {
        range = this.toMultiselect.store.getRange();
        this.toMultiselect.store.removeAll();
        this.valueChanged(this.toMultiselect.store);
    }
});

Ext.onReady(function() {
    Ext.QuickTips.init();

    var wizard_step_0 = new Ext.Panel({
        id: 'step-0',
        layout: 'form',
        title: 'Tables',
        frame: true,
        bodyStyle:'padding:5px 5px 0',
        items: [
            {
                // Table selector
                xtype: 'itemselector',
                id: 'tableselector',
                fieldLabel: 'Select tables:',
                imagePath: '/images/ux',
                allowDup: true,
                anchor:'98%',
                drawUpIcon: false,
                drawDownIcon: false,
                drawTopIcon: false,
                drawBotIcon: false,
                multiselects: [
                    {
                        ddReorder: false,
                        width: 250,
                        height: 200,
                        store: [
                            ['10','Ten'],
                            ['9','Nine']
                        ],
                        displayField: 'text',
                        valueField: 'value'
                    },
                    {
                        ddReorder: false,
                        width: 250,
                        height: 200,
                        displayField: 'text',
                        valueField: 'value',
                        store: [],
                        tbar:[
                            {
                                text: 'clear',
                                handler:function() {
                                    Ext.getCmp('tableselector').reset();
                                }
                            }
                        ]
                    }
                ]
            },
            {
                layout:'column',
                items:[
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [
                            {
                                xtype:'textfield',
                                fieldLabel: 'Left table',
                                name: 'left_table',
                                anchor:'95%'
                            }
                        ]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [
                            {
                                xtype:'textfield',
                                fieldLabel: 'Right table',
                                name: 'right_table',
                                anchor:'95%'
                            }
                        ]
                    }
                ]
            }
        ]
    });

    var wizardNav = function(incr) {
        var l = Ext.getCmp('create-query-wizard').getLayout();
        var i = l.activeItem.id.split('step-')[1];
        var next = parseInt(i) + incr;
        l.setActiveItem(next);
        Ext.getCmp('wizard-prev').setDisabled(next == 0);
        Ext.getCmp('wizard-next').setDisabled(next == 2);
    };

    var createQueryWizard = new Ext.form.FormPanel({
        id:'create-query-wizard',
//        title: 'Create Query (Wizard)',
        layout:'card',
        height: 400,
        activeItem: 0,
        bodyStyle: 'padding:0px',
        defaults: {border:false},
        bbar: ['->', {
            id: 'wizard-prev',
            text: '&laquo; Previous',
            handler: wizardNav.createDelegate(this, [-1]),
            disabled: true
        },{
            id: 'wizard-next',
            text: 'Next &raquo;',
            handler: wizardNav.createDelegate(this, [1])
        },{
            id: 'wizard-cancel',
            text: 'Cancel',
            handler: function () {
                Ext.getCmp('wizard-window').close();
            }
        },{
            id: 'wizard-save',
            text: 'Save',
            handler: function () {
                //                if(createQueryWizard.getForm().isValid()){
                Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
                                                  createQueryWizard.getForm().getValues(true));
                //                }
            }
        }],
        items: [
            wizard_step_0,
            {
                id: 'step-1',
                html: '<h1>Welcome to the Create Query Wizard!</h1><p>Step 1 of 9</p><p>Please click the "Next" button to continue...</p>'
            },
            {
                id: 'step-2',
                tag: 'div'
            }
        ]
    });

    var wizardWindow = new Ext.Window({
        id: 'wizard-window',
        layout:'fit',
        width:680,
        height:420,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        items: createQueryWizard
    });
    wizardWindow.show();
});