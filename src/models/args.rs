use std::path::PathBuf;

use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct CommandLineInterfaceArguments {
    /// Sets a custom config file
    #[arg(short, long, value_name = "PATH")]
    pub config: Option<PathBuf>,
}
