use exitcode;
use std::{error::Error, path::PathBuf, process};

use clap::Parser;
use models::{args::CommandLineInterfaceArguments, config::ApplicationConfig};

mod models;

fn main() -> Result<(), Box<dyn Error>> {
    let args = CommandLineInterfaceArguments::parse();

    let mut config_builder = ApplicationConfig::builder();

    if let Some(path) = &args.config {
        if path.exists() {
            config_builder.path(path);
        } else {
            eprintln!("Config file does not exist at {:?}", path);
            process::exit(exitcode::CONFIG)
        }
    } else {
        let global_cfg = PathBuf::from("./.gpt-config.json");

        if global_cfg.exists() {
            config_builder.path(&global_cfg);
        }
    }

    let config = config_builder.build()?;

    println!("args = {:?}", args);
    println!("config = {:?}", config);

    Ok(())
}
