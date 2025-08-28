      </Dialog>

      <Dialog
        header="会员详情"
        visible={!!detailId}
        onClose={() => setDetailId(null)}
        footer={
          <Button onClick={() => setDetailId(null)}>关闭</Button>
        }
      >
        {/* 详情内容待实现 */}
      </Dialog>
