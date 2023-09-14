use clap::Parser;
use models::args::CommandLineInterfaceArguments;

mod models;

fn main() {
    let args = CommandLineInterfaceArguments::parse();

    println!("args = {:?}", args);

    println!("Hello, world!");
}
