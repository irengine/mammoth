Ext.onReady(function() {
    Ext.QuickTips.init();

    var grid = new Ext.ux.DynamicGridPanel({
        id: 'my-grid',
        storeUrl: '/sandbox/grid/get_column_model',
        rowNumberer: true,
        checkboxSelModel: true,
        sm: new Ext.grid.CheckboxSelectionModel()
    });

    var gridWindow = new Ext.Window({
        id: 'grid-window',
        layout:'fit',
        width:680,
        height:420,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        items: grid
    });
    gridWindow.show();
});