# Đặc tả ứng dụng nghe nhạc local cho Windows

Tài liệu này mô tả một ứng dụng nghe nhạc local chuyên nghiệp dành cho Windows, tập trung vào khả năng nhập file nhạc nhiều định dạng, quản lý thư viện lớn, phát nhạc ổn định, và có giao diện thiết lập ban đầu khi người dùng cài đặt/xuất hiện lần đầu. Ứng dụng local chuyên nghiệp thường cần các lớp chính gồm nguồn file và import, media library/indexing, playback engine, business logic, và giao diện người dùng.[cite:1][cite:3]

## Mục tiêu sản phẩm

Ứng dụng hướng tới người dùng Windows muốn quản lý thư viện nhạc cá nhân thay vì streaming, với ưu tiên là mở được nhiều định dạng, quét thư viện nhanh, tìm kiếm tốt, hỗ trợ metadata đầy đủ, và vận hành ổn định khi chạy nền.[cite:1][cite:5][cite:6]

Các giá trị cốt lõi của sản phẩm:

- Hỗ trợ nhiều định dạng file audio local như MP3, WAV, FLAC, AAC, APE, MIDI và các định dạng phổ biến khác.[cite:5][cite:6]
- Duyệt thư viện theo bài hát, nghệ sĩ, album, thể loại, playlist và thư mục.[cite:1][cite:5][cite:14]
- Tối ưu cho trải nghiệm local-first, không phụ thuộc Internet để phát nhạc.[cite:6]
- Có luồng onboarding/setup rõ ràng ngay lần mở đầu tiên để người dùng chọn thư mục nhạc, cấu hình chế độ quét và thiết lập hành vi phát mặc định.[cite:1][cite:8]

## Nền tảng và phạm vi

### Nền tảng mục tiêu

- Hệ điều hành: Windows 10 và Windows 11.
- Mô hình app: desktop app local-first.
- Trạng thái thư viện: quản lý file có sẵn trên máy, ổ ngoài, thư mục mạng cục bộ hoặc thư mục do người dùng chỉ định.

### Phạm vi phiên bản đầu

Phiên bản đầu nên tập trung vào phát nhạc local, nhập thư viện nhiều nguồn, quản lý playlist, queue, metadata cơ bản, và giao diện phát nhạc ổn định. Các tính năng cloud sync, NAS sâu, đồng bộ thiết bị, hoặc store plugin nên để pha sau.[cite:3][cite:8]

## Luồng setup ban đầu

Ứng dụng cần có giao diện setup khi người dùng cài đặt xong và mở lần đầu, thay vì đưa thẳng vào màn hình thư viện rỗng. Luồng này giúp người dùng hoàn thành các bước cốt lõi như chọn nguồn nhạc, cấu hình import, và xác định trải nghiệm mặc định ngay từ đầu, phù hợp với đặc thù của app local music player.[cite:1][cite:8]

### Mục tiêu của setup wizard

- Giảm thời gian từ cài đặt đến lần phát nhạc đầu tiên.
- Hướng dẫn người dùng cấp quyền truy cập thư mục cần thiết.
- Thiết lập thư viện ban đầu mà không tạo cảm giác rối.
- Giải thích rõ app là local player, không tự tải nhạc từ Internet.[cite:6]

### Màn hình setup đề xuất

#### Bước 1: Chào mừng

Hiển thị mô tả ngắn: ứng dụng dùng để phát file nhạc local trên Windows, hỗ trợ nhiều định dạng và tổ chức thư viện tự động. Màn hình này nên có hai nút chính: `Bắt đầu thiết lập` và `Bỏ qua, vào app`.[cite:5][cite:6]

#### Bước 2: Chọn nguồn nhạc

Cho phép người dùng:

- Chọn một hoặc nhiều thư mục nhạc.
- Chọn ổ cứng ngoài hoặc thư mục mạng.
- Bật/tắt tự động quét lại khi thư mục thay đổi.
- Chọn có import thư mục Music mặc định của Windows hay không.

Đây là bước quan trọng nhất vì app local phụ thuộc vào nguồn file mà người dùng đang sở hữu.[cite:1][cite:5]

#### Bước 3: Tùy chọn quét thư viện

Các lựa chọn nên có:

- Quét nhanh chỉ metadata cơ bản.
- Quét đầy đủ gồm album art, lyrics file cục bộ, thông số bitrate/sample rate.
- Bỏ qua file trùng path hoặc trùng checksum.
- Bỏ qua file quá ngắn hoặc file hệ thống.

Việc index metadata từ đầu giúp duyệt thư viện nhanh hơn ở các tab Songs, Albums, Artists, và Folders thay vì phải đọc trực tiếp từ file mỗi lần mở màn hình.[cite:1][cite:3]

#### Bước 4: Cài đặt phát mặc định

Các tùy chọn nên gồm:

- Tự phát bài cuối cùng khi mở app.
- Ghi nhớ queue cuối cùng.
- Ghi nhớ vị trí phát cuối với track dài.
- Bật phát tiếp khi cắm tai nghe/Bluetooth.
- Bật crossfade hoặc gapless nếu khả dụng.

Khả năng nhớ trạng thái phát và vị trí cuối là nhu cầu thực tế được người dùng local audio đánh giá cao.[cite:2][cite:10]

#### Bước 5: Giao diện và âm thanh

Cho phép chọn:

- Theme sáng/tối/theo hệ thống.
- Chế độ hiển thị mặc định: Library hoặc Now Playing.
- Preset EQ mặc định nếu bật DSP.
- Kích thước artwork và layout danh sách.

#### Bước 6: Tóm tắt và bắt đầu quét

Màn hình cuối hiển thị các thư mục đã chọn, số nguồn sẽ quét, tùy chọn ghi nhớ queue, chế độ theme, và nút `Bắt đầu xây dựng thư viện`. Trong lúc quét, app cần hiện tiến trình, số file đã đọc, số file hợp lệ, số file lỗi, và cho phép vào app ngay khi quét nền tiếp tục chạy.[cite:1][cite:3]

## Chức năng cốt lõi

### 1. Import và quản lý nguồn nhạc

Ứng dụng phải hỗ trợ thêm, sửa, xóa nguồn thư mục nhạc bất kỳ lúc nào. Hệ thống cần tự phát hiện file mới, file bị xóa, file đổi tên, và cập nhật thư viện tương ứng mà không làm mất playlist hay lịch sử phát nếu vẫn còn ánh xạ hợp lệ.[cite:1][cite:5]

### 2. Hỗ trợ định dạng âm thanh

Ít nhất cần hỗ trợ tốt các định dạng phổ biến như MP3, WAV, FLAC, AAC, APE, MIDI; đồng thời kiến trúc nên mở để bổ sung ALAC, OGG, M4A, AIFF hoặc các định dạng hi-res ở các phiên bản sau. Một số ứng dụng cao cấp cho thấy hỗ trợ file chất lượng cao là yếu tố quan trọng với nhóm người dùng yêu âm thanh.[cite:3][cite:5][cite:6]

### 3. Scan và indexing thư viện

Sau khi phát hiện file, app cần đọc metadata như title, artist, album, genre, track number, disc number, artwork, bitrate, sample rate, duration và path. Dữ liệu này phải được ghi vào cơ sở dữ liệu cục bộ để tối ưu cho tìm kiếm, sort, filter và hiển thị tức thời.[cite:1][cite:3]

### 4. Duyệt thư viện

Ứng dụng cần cung cấp các chế độ duyệt sau:

- Songs
- Artists
- Albums
- Genres
- Folders
- Playlists
- Favorites
- Recently Added
- Most Played
- Recently Played

Khả năng duyệt theo thư mục đặc biệt quan trọng với app local vì nhiều thư viện nhạc cá nhân được tổ chức theo cây thư mục thay vì metadata hoàn chỉnh.[cite:1][cite:14]

### 5. Playback engine

Playback engine là thành phần quan trọng nhất và phải hỗ trợ play, pause, stop, seek, next, previous, shuffle, repeat, queue management, và background playback ổn định. Engine cũng cần xử lý tốt điều khiển từ media keys, notification, lock screen, tai nghe, Bluetooth, và khôi phục trạng thái khi ứng dụng mở lại.[cite:2][cite:8][cite:10]

### 6. Queue và playlist

Cần tách rõ:

- Playlist: danh sách lưu bền vững do người dùng tạo.
- Queue: hàng chờ phát tạm thời của phiên hiện tại.

Thiết kế nâng cao có thể hỗ trợ nhiều queue độc lập, một điểm làm nên khác biệt ở các app local được đánh giá cao.[cite:10]

### 7. Tìm kiếm và lọc

Tìm kiếm phải hỗ trợ title, artist, album, filename, folder path và có thể thêm gợi ý gần đúng. Bộ lọc nên cho phép lọc theo định dạng, thời lượng, bitrate, thời điểm thêm vào, yêu thích, hoặc thư mục nguồn.[cite:1][cite:5]

### 8. Metadata và chỉnh sửa tag

Ứng dụng nên có tag editor cho từng file và cho nhiều file cùng lúc. Các trường nên cho chỉnh sửa gồm title, artist, album, album artist, genre, year, track number, disc number, lyrics file path, comment và artwork.[cite:10]

### 9. Tính năng âm thanh nâng cao

Các tính năng nên có trong bản chuyên nghiệp:

- Equalizer nhiều băng tần.
- Bass boost.
- Reverb hoặc preset âm thanh.
- Gapless playback.
- Crossfade tùy chọn.
- Replay gain hoặc volume normalization trong pha sau.

Một số trình phát nhạc local hiện đại được đánh giá tốt nhờ kết hợp tính năng cơ bản với EQ, sleep timer và các công cụ tinh chỉnh nghe nhạc hằng ngày.[cite:10][cite:14]

### 10. Trạng thái phát và resume

Ứng dụng nên lưu:

- Queue cuối cùng.
- Track cuối cùng.
- Vị trí phát cuối.
- Chế độ shuffle/repeat.
- Thiết bị output gần nhất nếu phù hợp.

Khả năng nhớ vị trí phát cuối đặc biệt hữu ích cho file dài như live set, mix, audiobook hoặc podcast local.[cite:2]

## Giao diện người dùng

### Các màn hình chính

| Màn hình | Mục đích |
|---|---|
| Welcome/Setup | Thiết lập nguồn nhạc và cấu hình ban đầu |
| Home/Library | Tổng quan thư viện, truy cập nhanh |
| Songs | Danh sách toàn bộ bài hát |
| Albums | Duyệt theo album |
| Artists | Duyệt theo nghệ sĩ |
| Folders | Duyệt theo cấu trúc thư mục |
| Playlists | Quản lý playlist |
| Search | Tìm kiếm nhanh toàn thư viện |
| Now Playing | Điều khiển phát nhạc, artwork, queue |
| Settings | Thiết lập nguồn, âm thanh, giao diện |

Các nguồn tham khảo về player local đều cho thấy việc duyệt theo bài hát, album, nghệ sĩ, playlist và thư mục là phần cốt lõi của trải nghiệm người dùng.[cite:1][cite:5][cite:14]

### Màn hình Now Playing

Now Playing nên có:

- Album art lớn.
- Tên bài, nghệ sĩ, album.
- Thanh tiến trình và thời lượng.
- Nút play/pause, next, previous.
- Shuffle, repeat, favorite.
- Mở queue hiện tại.
- Mở lyrics nếu có.
- Menu nhanh: mở thư mục chứa file, sửa tag, thêm vào playlist.

### Sidebar hoặc navigation

Windows app nên ưu tiên layout 2 cột hoặc 3 cột: sidebar điều hướng bên trái, danh sách nội dung ở giữa, và panel chi tiết/queue bên phải khi màn hình đủ rộng. Với cửa sổ nhỏ, panel phải có thể thu gọn để giữ trải nghiệm gọn và hiện đại.

## Kiến trúc hệ thống đề xuất

### Thành phần hệ thống

1. **Installer + First-run setup**: xử lý cài đặt và wizard ban đầu.
2. **Source Manager**: quản lý các thư mục nguồn.
3. **Scanner Service**: quét file và theo dõi thay đổi.
4. **Metadata Parser**: đọc tag và thông số âm thanh.
5. **Library Database**: lưu index cục bộ.
6. **Playback Engine**: decode và phát audio.
7. **Playback Session Manager**: quản lý queue, trạng thái, resume.
8. **UI Layer**: hiển thị thư viện, tìm kiếm, now playing.
9. **Settings Manager**: quản lý cấu hình người dùng.
10. **Diagnostics/Logs**: ghi lỗi scan, lỗi decode, lỗi file hỏng.

Mô hình phân lớp này phù hợp với yêu cầu của app local chuyên nghiệp: import nguồn, index metadata, sau đó tối ưu duyệt thư viện và playback độc lập với giao diện.[cite:1][cite:3][cite:8]

### Luồng dữ liệu

1. Người dùng cài app và mở lần đầu.
2. Setup wizard yêu cầu chọn nguồn nhạc.
3. Scanner Service duyệt file theo nguồn đã chọn.
4. Metadata Parser trích xuất thông tin từ file audio.
5. Library Database lưu bản ghi track/album/artist/folder.
6. UI đọc từ database để hiển thị nhanh.
7. Khi người dùng phát nhạc, Playback Engine lấy file theo path/URI đã index.
8. Playback Session Manager lưu queue và trạng thái phát hiện tại.
9. Khi đóng và mở lại app, session được phục hồi theo cấu hình người dùng.[cite:1][cite:2][cite:3]

## Thiết kế dữ liệu

### Bảng Track

- `id`
- `path`
- `file_name`
- `format`
- `duration_ms`
- `bitrate`
- `sample_rate`
- `channels`
- `title`
- `artist`
- `album`
- `album_artist`
- `genre`
- `year`
- `track_number`
- `disc_number`
- `artwork_path`
- `lyrics_path`
- `date_added`
- `last_played_at`
- `play_count`
- `is_favorite`
- `hash`
- `scan_status`

### Bảng FolderSource

- `id`
- `path`
- `display_name`
- `is_enabled`
- `watch_for_changes`
- `last_scan_at`

### Bảng Playlist

- `id`
- `name`
- `created_at`
- `updated_at`
- `cover_art_path`

### Bảng PlaylistItem

- `id`
- `playlist_id`
- `track_id`
- `position`

### Bảng PlaybackSession

- `id`
- `current_track_id`
- `current_position_ms`
- `repeat_mode`
- `shuffle_enabled`
- `volume`
- `last_output_device`
- `updated_at`

## Yêu cầu phi chức năng

### Hiệu năng

- Khởi động app nhanh ngay cả khi thư viện lớn.
- Quét thư viện ban đầu chạy nền và không làm treo UI.
- Tìm kiếm trả kết quả gần như tức thì từ local database.
- Chuyển bài và seek mượt với file dung lượng lớn.

### Độ ổn định

- Không crash nếu gặp file hỏng hoặc metadata lỗi.
- Có cơ chế skip file lỗi và ghi log chẩn đoán.
- Không mất playlist hay trạng thái chỉ vì một nguồn thư mục tạm thời unavailable.

### Trải nghiệm người dùng

- Có dark mode và light mode.
- Hỗ trợ phím media trên bàn phím.
- Hỗ trợ kéo-thả file/thư mục vào app để import.
- Có notification hoặc mini player khi thu nhỏ.

## Gợi ý công nghệ cho Windows

### Option 1: WinUI 3 + C#

Phù hợp nếu muốn giao diện native Windows, tích hợp tốt với notification, media session, installer và shell của hệ điều hành. Đây là lựa chọn mạnh cho trải nghiệm desktop hiện đại và đúng chất Windows.

### Option 2: .NET WPF + C#

Phù hợp nếu cần hệ sinh thái ổn định, nhiều thư viện lâu năm, dễ làm desktop app giàu tính năng. WPF vẫn phù hợp với app local có UI phức tạp và custom control.

### Option 3: Electron + React + native audio backend

Phù hợp nếu muốn tốc độ phát triển nhanh, UI linh hoạt, dễ tích hợp design system hiện đại. Tuy nhiên cần xử lý kỹ tài nguyên RAM, audio backend và packaging cho Windows để tránh cảm giác nặng.

## Tính năng nên để pha sau

- Đồng bộ cloud settings.
- Đọc thư viện NAS chuyên sâu.
- Lyrics đồng bộ online.
- Visualizer nâng cao.
- Plugin system.
- Podcast/audiobook mode riêng.
- Multi-device sync.

## Yêu cầu dành cho Claude khi triển khai

Khi dùng tài liệu này để yêu cầu Claude tạo app, nên yêu cầu rõ các điểm sau:

- Tạo desktop app chạy trên Windows 10/11.
- Có giao diện setup wizard ở lần mở đầu tiên sau cài đặt.
- Cho phép chọn nhiều thư mục local và import nhiều định dạng audio.
- Có thư viện duyệt theo Songs, Albums, Artists, Folders, Playlists.
- Có Now Playing, queue, resume last session, và search nhanh.
- Có cơ sở dữ liệu local để index metadata.
- Có playback engine ổn định, hỗ trợ background playback và media keys.
- Có Settings để thêm/xóa nguồn nhạc sau khi setup xong.
- Thiết kế UI hiện đại, tối ưu cho desktop Windows.

## Prompt mẫu ngắn để đưa cho Claude

```text
Hãy xây dựng một ứng dụng desktop nghe nhạc local cho Windows 10/11 với giao diện hiện đại. Ứng dụng phải có setup wizard ở lần mở đầu tiên sau khi cài đặt để người dùng chọn các thư mục chứa nhạc, cấu hình quét thư viện, và thiết lập chế độ phát mặc định. App phải hỗ trợ nhiều định dạng audio local như MP3, WAV, FLAC, AAC, APE, MIDI; có thư viện duyệt theo Songs, Albums, Artists, Folders, Playlists; có Now Playing, queue, tìm kiếm nhanh, ghi nhớ bài đang phát và vị trí phát cuối. Hãy thiết kế kiến trúc rõ ràng gồm scanner service, metadata parser, local database, playback engine, settings manager và UI layer. Ưu tiên trải nghiệm desktop Windows chuyên nghiệp, hiệu năng tốt, và khả năng mở rộng về sau.
```
