mod commands;

use commands::*;
use tauri_plugin_deep_link::DeepLinkExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {
            // Deep link event is already triggered by the plugin
        }));
    }

    builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
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
        .setup(|app| {
            // Check if app was started via deep link
            if let Some(urls) = app.deep_link().get_current()? {
                for url in &urls {
                    if let Some(token) = extract_launch_token(url.as_str()) {
                        app.emit("inkos-launch", token)?;
                    }
                }
            }

            // Listen for deep link events while running
            let handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                for url in event.urls() {
                    if let Some(token) = extract_launch_token(url.as_str()) {
                        let _ = handle.emit("inkos-launch", &token);
                    }
                }
            });

            #[cfg(desktop)]
            app.deep_link().register_all()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running InkOS");
}

/// Extract token from `inkos://launch?token=xxx`
fn extract_launch_token(url: &str) -> Option<String> {
    let url = url::Url::parse(url).ok()?;
    if url.host_str() == Some("launch") || url.path().trim_start_matches('/') == "launch" {
        url.query_pairs()
            .find(|(k, _)| k == "token")
            .map(|(_, v)| v.into_owned())
    } else {
        None
    }
}

fn main() {
    run();
}
