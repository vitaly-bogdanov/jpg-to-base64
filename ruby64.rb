require 'base64'
require 'json'

class SecretJpg
  EXTENTIONS = ['.jpg']
  ENCODED_FILE_NAME = 'code.json'
  DECODED_DIR_NAME = 'decoded'

  # Метод кодирует все файлы с расширением jpg,
  # находящиеся в одной папке со скриптом
  # и создаст json файл, в который поместит
  # результат
  def self.encode
    encoded_files = Dir.entries('./')
      .select { |file_name| File.extname(file_name) == '.jpg' }
      .map { |name| [] << name << Base64.encode64(IO.binread "./#{name}") }
    if File.exist? ENCODED_FILE_NAME
      File.delete("./#{ENCODED_FILE_NAME}")
    end
    File.open("./#{ENCODED_FILE_NAME}", 'w') { |file| file.write JSON.generate(encoded_files) }
    return :ok
  end

  # Метод раскодирует информацию из файла json
  # и создаст папку, в которую поместит
  # результат
  def self.decode
    if File.exist? ENCODED_FILE_NAME
      JSON.parse(File.read('./code.json')).map do |file_name, value|
        unless Dir.exist? DECODED_DIR_NAME
          Dir.mkdir DECODED_DIR_NAME
        end
        File.open("./#{DECODED_DIR_NAME}/#{file_name}", 'w') { |file| file.write Base64.decode64(value) }
      end
    else
      raise 'В исходной директории нет файла для расшифровки'
    end
    return :ok
  end

  def self.clear
    clear_code
    clear_dir
    return :ok
  end

  def self.clear_code
    if File.exist? "./#{ENCODED_FILE_NAME}"
      File.delete("./#{ENCODED_FILE_NAME}")
    end
    return nil
  end

  def self.clear_dir
    if Dir.exist? DECODED_DIR_NAME
      Dir.entries("./#{DECODED_DIR_NAME}")
        .select { |file_name| File.extname(file_name) == '.jpg' }
        .each { |file_name| File.delete("./#{DECODED_DIR_NAME}/#{file_name}") }
      Dir.rmdir DECODED_DIR_NAME
    end
    return nil
  end
end