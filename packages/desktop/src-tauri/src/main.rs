mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            list_books,
            read_file_text,
            write_file_text,
            list_dir,
            delete_path,
            path_exists,
            select_workspace,
            read_book_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running InkOS");
}

fn main() {
    run();
}
