# Script chuyển đổi tất cả text sang tiếng Việt

$replacements = @(
    # receive.html
    @{
        File = "receive.html"
        Old = "                <h1>Receive Crypto</h1>"
        New = "                <h1>Nhận Crypto</h1>"
    },
    @{
        File = "receive.html"
        Old = "                  Share your wallet address to receive cryptocurrency"
        New = "                  Chia sẻ địa chỉ ví của bạn để nhận tiền điện tử"
    },
    @{
        File = "receive.html"
        Old = "                <span>Back to Wallet</span>"
        New = "                <span>Quay Lại Ví</span>"
    },
    @{
        File = "receive.html"
        Old = "              <h3>Select Network</h3>"
        New = "              <h3>Chọn Mạng</h3>"
    },
    @{
        File = "receive.html"
        Old = "              <h3>Scan QR Code</h3>"
        New = "              <h3>Quét Mã QR</h3>"
    },
    @{
        File = "receive.html"
        Old = "                <span>Ethereum Network</span>"
        New = "                <span>Mạng Ethereum</span>"
    },
    @{
        File = "receive.html"
        Old = "              <h3>Your Wallet Address</h3>"
        New = "              <h3>Địa Chỉ Ví Của Bạn</h3>"
    },
    @{
        File = "receive.html"
        Old = "                    <span>Copy</span>"
        New = "                    <span>Sao Chép</span>"
    },
    @{
        File = "receive.html"
        Old = "                    <span>Share</span>"
        New = "                    <span>Chia Sẻ</span>"
    },
    @{
        File = "receive.html"
        Old = "                <h4>Important Notice</h4>"
        New = "                <h4>Lưu Ý Quan Trọng</h4>"
    },
    @{
        File = "receive.html"
        Old = "              <h3>Expected Asset (Optional)</h3>"
        New = "              <h3>Tài Sản Mong Đợi (Tùy Chọn)</h3>"
    },
    @{
        File = "receive.html"
        Old = "                <option value=`"any`">Any Asset</option>"
        New = "                <option value=`"any`">Bất Kỳ Tài Sản</option>"
    },
    @{
        File = "receive.html"
        Old = "                Selecting an asset helps you track incoming transfers"
        New = "                Chọn tài sản giúp bạn theo dõi các giao dịch đến"
    },
    
    # transactions.html
    @{
        File = "transactions.html"
        Old = "                <h1>Transaction History</h1>"
        New = "                <h1>Lịch Sử Giao Dịch</h1>"
    },
    @{
        File = "transactions.html"
        Old = "                <p class=`"page-subtitle`">View all your wallet transactions</p>"
        New = "                <p class=`"page-subtitle`">Xem tất cả giao dịch ví của bạn</p>"
    },
    @{
        File = "transactions.html"
        Old = "              <label>Type:</label>"
        New = "              <label>Loại:</label>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"all`">All</option>"
        New = "                <option value=`"all`">Tất Cả</option>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"send`">Send</option>"
        New = "                <option value=`"send`">Gửi</option>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"receive`">Receive</option>"
        New = "                <option value=`"receive`">Nhận</option>"
    },
    @{
        File = "transactions.html"
        Old = "              <label>Status:</label>"
        New = "              <label>Trạng Thái:</label>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"success`">Success</option>"
        New = "                <option value=`"success`">Thành Công</option>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"pending`">Pending</option>"
        New = "                <option value=`"pending`">Đang Chờ</option>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"failed`">Failed</option>"
        New = "                <option value=`"failed`">Thất Bại</option>"
    },
    @{
        File = "transactions.html"
        Old = "              <label>Asset:</label>"
        New = "              <label>Tài Sản:</label>"
    },
    @{
        File = "transactions.html"
        Old = "                <option value=`"all`">All Assets</option>"
        New = "                <option value=`"all`">Tất Cả Tài Sản</option>"
    },
    @{
        File = "transactions.html"
        Old = "            <button class=`"btn-secondary`" id=`"refresh-btn`">🔄 Refresh</button>"
        New = "            <button class=`"btn-secondary`" id=`"refresh-btn`">🔄 Làm Mới</button>"
    }
)

# Apply replacements
foreach ($r in $replacements) {
    $filePath = Join-Path "d:\nhom2_E-wallet\frontend" $r.File
    $content = Get-Content $filePath -Raw
    $content = $content -replace [regex]::Escape($r.Old), $r.New
    Set-Content $filePath $content -NoNewline
    Write-Host "Updated $($r.File)" -ForegroundColor Green
}

Write-Host "Conversion complete!" -ForegroundColor Cyan
